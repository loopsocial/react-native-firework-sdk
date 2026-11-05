import FireworkVideo
import FireworkVideoIVSSupport
import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit
import react_native_firework_sdk

@main
class AppDelegate: RCTAppDelegate {
    /// Kept for `SceneDelegate`, which creates the React Native root view.
    private(set) var launchOptions: [AnyHashable: Any]?

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        // The window is created by SceneDelegate, since apps built with the iOS 27 SDK must use the UIScene life cycle.
        self.automaticallyLoadReactNativeWindow = false
        self.launchOptions = launchOptions
        self.moduleName = "FireworkSdkExample"
        self.dependencyProvider = RCTAppDependencyProvider()

        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        self.initialProps = [:]

        FWReactNativeSDK.initializeSDK(
            SDKInitOptions(videoLaunchBehavior: .muteOnFirstLaunch)
        )
        FireworkVideoSDK.enableIVSPlayback()
        // Debug-only: swizzles UIViewController lifecycle methods to log when
        // Firework-related view controllers appear/disappear. This is purely a
        // debugging aid for the example app — host apps do NOT need to call this.
        UIViewController.swizzleFireworkLifecycleLogging()

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    override func sourceURL(for bridge: RCTBridge) -> URL? {
        self.bundleURL()
    }

    override func bundleURL() -> URL? {
        #if DEBUG
            RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
