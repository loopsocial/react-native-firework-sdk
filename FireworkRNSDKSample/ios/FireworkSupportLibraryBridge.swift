//
//  SwiftBridge.swift
//  FireworkSdkExample
//
//  Created by linjie jiang on 4/3/23.
//

import Foundation
import FireworkVideo
 import FireworkVideoIVSSupport
// import FireworkVideoAgoraSupport

import FireworkVideoUI
import react_native_firework_sdk
import AppTrackingTransparency

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
  @objc public static func requestIDFAPermision() {
      if #available(iOS 14.5, *) {
          ATTrackingManager.requestTrackingAuthorization { status in
              switch status {
              case .authorized:
                  debugPrint("ATT permission authorized")
              case .denied:
                  debugPrint("ATT permission denied")
              case .notDetermined:
                  debugPrint("ATT permission notDetermined")
              case .restricted:
                  debugPrint("ATT permission restricted")
              @unknown default:
                  break
              }
          }
      } else {}
  }
  @objc public static func enableIVSPlayback() {
    FireworkVideoSDK.enableIVSPlayback()
  }
}

class CustomProductView: UIView, ProductCardViewRepresentable {
  func prepareForReuse() {

  }

  func updateViewForProduct(_ product: ProductCardDetails, associatedTo video: VideoDetails) {

  }
}
