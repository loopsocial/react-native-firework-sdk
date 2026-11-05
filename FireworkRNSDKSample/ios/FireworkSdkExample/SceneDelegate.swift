import React
import React_RCTAppDelegate
import UIKit

/// Apps built with the iOS 27 SDK must use the UIScene life cycle, so the React Native window is created here instead
/// of in `RCTAppDelegate.application(_:didFinishLaunchingWithOptions:)`.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene,
              let appDelegate = UIApplication.shared.delegate as? AppDelegate
        else { return }

        let rootView = appDelegate.rootViewFactory().view(
            withModuleName: appDelegate.moduleName ?? "",
            initialProperties: appDelegate.initialProps,
            launchOptions: appDelegate.launchOptions
        )
        let rootViewController = appDelegate.createRootViewController()
        appDelegate.setRootView(rootView, toRootViewController: rootViewController)

        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = rootViewController
        self.window = window
        // Code that still reads `UIApplication.shared.delegate?.window` keeps finding the React Native window.
        appDelegate.window = window
        window.makeKeyAndVisible()
    }

    func windowScene(
        _ windowScene: UIWindowScene,
        didUpdate previousCoordinateSpace: UICoordinateSpace,
        interfaceOrientation previousInterfaceOrientation: UIInterfaceOrientation,
        traitCollection previousTraitCollection: UITraitCollection
    ) {
        // RCTAppDelegate posted this while it was the scene delegate; React Native updates its dimensions from it.
        NotificationCenter.default.post(name: NSNotification.Name.RCTWindowFrameDidChange, object: self)
    }
}
