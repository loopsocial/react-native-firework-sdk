//
//  SwiftBridge.swift
//  FireworkSdkExample
//
//  Created by linjie jiang on 4/3/23.
//

import Foundation
import FireworkVideo
// import FireworkVideoGAMSupport
// import FireworkVideoGIMASupport
// import FireworkVideoAgoraSupport

// import react_native_firework_sdk
#if canImport(FireworkVideoUI)
import FireworkVideoUI
#endif

@objc
public class FireworkSupportLibraryBridge: NSObject {
//  @objc public static func enableVideoGAM() {
//    FireworkVideoGAMSupportSDK.initializeSDK()
//  }

//  @objc public static func enableVideoGIMA() {
//    FireworkVideoGIMASupportSDK.enableIMAAds()
//  }

  @objc public static func enableMultiHostPlayback() {
//    FireworkVideoSDK.enableMultiHostPlayback()
  }

  @objc public static func changeLanguage(_ language: String?) {
//    AppLanguageManager.shared.changeAppLanguage(language)
  }
}
