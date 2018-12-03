//
//  TextDetector.m
//  my-new-project
//
//  Created by Zhengzhe Yang on 10/3/18.
//  Copyright © 2018 650 Industries, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import "TextDetector.h"
#import "UIImage+FixOrientation.h"

#import <CoreML/CoreML.h>
#import <Vision/Vision.h>
#import <TesseractOCR/TesseractOCR.h>

//@import GoogleMobileVision;

@implementation TextDetector
static NSString *const noResultsMessage = @"No Results";

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()
static NSString *const detectionNoResultsMessage = @"Something went wrong";
RCT_REMAP_METHOD(scan, scan:(NSString *)imageURL :(double)x :(double)y :(double)width :(double)height
                 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    // convert image from react native to UIImage
//    UIImage *image = [RCTConvert UIImage:beforeConvertImage];
    
    
    
    // if image is null, resolve @NO
    if (!imageURL) {
        resolve(@NO);
        return;
    }
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // An image analysis request that finds regions of visible text in an image.
        VNDetectTextRectanglesRequest *textReq = [VNDetectTextRectanglesRequest new];
        
        // dict to store information about analysis requests
        NSDictionary *d = [[NSDictionary alloc] init];
        
        // construct image data with url passed from React Native
        NSData *imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:imageURL]];
        
        // the actual image
        UIImage *imageBeforeCrop = [UIImage imageWithData:imageData];
        UIImage *test = [imageBeforeCrop FixOrientation];
        
        
        // crop the image first
        UIImage *image = nil;
        CGRect cropRect = CGRectMake((CGFloat)x, (CGFloat)y, (CGFloat)width, (CGFloat)height);
        image = [self crop:test toRect:cropRect];
//        struct CGImage cg = image.CGImage;
        
        // initialize analysis request handler with NSData
        VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:image.CGImage options:d];
        
        // error message if requests or analysis failed
        NSError *error;
        
        // perform analysis on the image and find area with texts
        [handler performRequests:@[textReq] error:&error];
        
        // if there's error or no results, resolve error message
        if (error || !textReq.results || textReq.results.count == 0) {
            NSString *errorString = error ? error.localizedDescription : detectionNoResultsMessage;
            NSDictionary *pData = @{
                                    @"error": [NSMutableString stringWithFormat:@"On-Device text detection failed with error: %@", errorString],
                                    };
            // Running on background thread, don't call UIKit
            dispatch_async(dispatch_get_main_queue(), ^{
                resolve(pData);
            });
            return;
        }
        
        
        // initialize tesseract
        G8Tesseract *tesseract = [[G8Tesseract alloc] initWithLanguage:@"eng"];
        tesseract.delegate = self;
        tesseract.charWhitelist = @"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.!?@#$%^&*():;<>~`|\[]{}-_=+";
        [tesseract setImage:image];
        CGRect boundingBox;
        CGSize size;
        CGPoint origin;
        
        // output array to store information
        NSMutableArray *output = [NSMutableArray array];
        
        // traverse the analyzed features
        for(VNTextObservation *observation in textReq.results){
            // if Apple vision detects texts
            if(observation){
                // blocks of texts
                NSMutableDictionary *block = [NSMutableDictionary dictionary];
                NSMutableDictionary *bounding = [NSMutableDictionary dictionary];
                
                // the bounding of a block
                boundingBox = observation.boundingBox;
                
                // text block size
                size = CGSizeMake(boundingBox.size.width * image.size.width, boundingBox.size.height * image.size.height);
                origin = CGPointMake(boundingBox.origin.x * image.size.width, (1-boundingBox.origin.y)*image.size.height - size.height);
                
                // recognizing area
                tesseract.rect = CGRectMake(origin.x, origin.y, size.width, size.height);
                
                // start recognizing
                [tesseract recognize];
                
                bounding[@"top"] = @(origin.y);
                bounding[@"left"] = @(origin.x);
                bounding[@"width"] = @(size.width);
                bounding[@"height"] = @(size.height);
//                block[@"text"] = [tesseract.recognizedText stringByReplacingOccurrencesOfString:@"\n" withString:@""];
                block[@"text"] = tesseract.recognizedText;
                block[@"bounding"] = bounding;
                [output addObject:block];
            }
        }
        
        // resolve final result
        dispatch_async(dispatch_get_main_queue(), ^{
            // Convert your array to JSON data
//            NSData *jsonArray = [self arrayToJSON: output];
//            // Pass the JSON to an UTF8 string
//            NSString *jsonString = [[NSString alloc] initWithData:jsonArray
//                                                         encoding:NSUTF8StringEncoding];
//            // Base64 encode the string to avoid problems
//            NSString *encodedString = [Base64 encode:jsonString];
//            // Evaluate your JavaScript function with the encoded string as input
//            NSString *jsCall = [NSString stringWithFormat:@"yourJsFunction(\"%@\")", encodedString];
//            [self.webView stringByEvaluatingJavaScriptFromString:jsCall];
            NSLog(@"completeDict: %@", output);
            resolve(output);
        });
    });
}

- (UIImage *)crop:(UIImage *)imageToCrop toRect:(CGRect)rect
{
    //CGRect CropRect = CGRectMake(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height+15);
    
    CGImageRef imageRef = CGImageCreateWithImageInRect([imageToCrop CGImage], rect);
    UIImage *cropped = [UIImage imageWithCGImage:imageRef];
    CGImageRelease(imageRef);
    
    return cropped;
}


@end
