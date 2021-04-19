//
//  AppDelegate.swift
//  tv
//
//  Created by Jefferson Moran on 23/03/21.
//

import Foundation
import FireworkVideo

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, FireworkVideoSDKDelegate {
  var window: UIWindow?
  var bridge: RCTBridge!

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let jsCodeLocation: URL

    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "tv", initialProperties: nil, launchOptions: launchOptions)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    
    let nav_controller: UINavigationController = window?.rootViewController as! UINavigationController
    let root_controller : UIViewController = nav_controller.viewControllers[0] as! UIViewController
    
    FireworkVideoSDK.initializeSDK(delegate: self)
    
    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.window?.rootViewController = root_controller
    self.window?.makeKeyAndVisible()

    return true
  }
  
  func fireworkVideoDidLoadSuccessfully() {
      print("FireworkVideo loaded successfully.")
    }

    func fireworkVideoDidLoadWith(error: FireworkVideoSDKError) {
      switch error {
      case .missingAppID:
          print("FireworkVideo loaded with error due to missing app ID.")
      case .authenticationFailure:
          print("FireworkVideo loaded with error due to authentication failure.")
      default:
          break
      }
    }
}
