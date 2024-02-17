//
//  SwiftBridge.swift
//  FireworkSdkExample
//
//  Created by linjie jiang on 4/3/23.
//

import Foundation
import FireworkVideo
// import FireworkVideoIVSSupport
// import FireworkVideoAgoraSupport

import FireworkVideoUI
import react_native_firework_sdk

@objc
public class FireworkSupportLibraryBridge: NSObject {
    @objc public static func initFireworkSDK() {
      FWReactNativeSDK.initializeSDK(
        SDKInitOptions(videoLaunchBehavior: .muteOnFirstLaunch)
      )
    }
//  @objc public static func enableVideoGAM() {
//    FireworkVideoGAMSupportSDK.initializeSDK()
//  }

//  @objc public static func enableVideoGIMA() {
//    FireworkVideoGIMASupportSDK.enableIMAAds()
//  }

//  @objc public static func enableMultiHostPlayback() {
//    FireworkVideoSDK.enableMultiHostPlayback()
//  }
//
//  @objc public static func enableIVSPlayback() {
//    FireworkVideoSDK.enableIVSPlayback()
//  }
}

class CustomProductView: UIView, ProductCardViewRepresentable {
  func prepareForReuse() {

  }

  func updateViewForProduct(_ product: ProductCardDetails, associatedTo video: VideoDetails) {

  }
}
