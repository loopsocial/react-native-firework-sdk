
# react-native-firework-tv-lib

### Manual installation

#### Android

# Configure Android Side
    * Follow this tutorial to get the Android SDK configuration: https://github.com/loopsocial/firework_sdk_official
    * Then create in your layout folder a file named activity_firework.xml:

# Adding the layout
	``` xml
		<?xml version="1.0" encoding="utf-8"?>
		<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
			xmlns:app="http://schemas.android.com/apk/res-auto"
			xmlns:tools="http://schemas.android.com/tools"
			android:layout_width="match_parent"
			android:layout_height="match_parent"
			tools:context=".FireworkActivity">

			<com.loopnow.fireworklibrary.views.VideoFeedView
				android:layout_width="match_parent"
				android:layout_height="match_parent"
				app:showTitle="true"
				app:feedLayout="grid"
				app:columns="3"
				/>

		</androidx.constraintlayout.widget.ConstraintLayout>
	```

# Main Activity Bind
    Add this in the MainActivity.java

    ``` java
		import android.os.Bundle;

		public class MainActivity extends ReactActivity {

			@Override
			protected void onCreate(Bundle savedInstanceState) {
				super.onCreate(savedInstanceState);
				setContentView(R.layout.activity_firework);
			}
		}
    ```

# Configure iOS Side
    * Follow this tutorial to get the iOS SDK configuration: https://github.com/loopsocial/firework_ios_sdk
    * Then create in your App folder a file named ViewController.swift and add the following:

# Adding the layout
    Create a ViewController then add the following code:

    ``` swift
        import UIKit
		import FireworkVideo

		class ViewController: UIViewController {
			override func viewDidLoad() {
				super.viewDidLoad()
				embedFeedInViewController()
				// Do any additional setup after loading the view.
			}
			
			func embedFeedInViewController() {
				let gridVC = VideoFeedViewController()
				gridVC.view.backgroundColor = .systemBackground
				let layout = VideoFeedGridLayout()
				layout.numberOfColumns = 3
				layout.contentInsets = UIEdgeInsets(top: 16, left: 8, bottom: 16, right: 8)
				gridVC.layout = layout
				var config = gridVC.viewConfiguration
				config.backgroundColor = .white
				gridVC.viewConfiguration.playerView.videoCompleteAction = .loop
				gridVC.viewConfiguration = config
				self.addChild(gridVC)
				self.view.addSubview(gridVC.view)
				gridVC.view.frame = self.view.bounds
				gridVC.willMove(toParent: self)
			}
		}
    ```

# AppDelegate lib configuration
    Add this in the AppDelegate.swift
	Change [PROJECT_NAME] to match your iOS app name.

    ``` swift
        import Foundation
		import FireworkVideo

		@UIApplicationMain
		class AppDelegate: UIResponder, UIApplicationDelegate, FireworkVideoSDKDelegate {
			var window: UIWindow?
			var bridge: RCTBridge!

			func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
				let jsCodeLocation: URL

				jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
				let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "[PROJECT_NAME]", initialProperties: nil, launchOptions: launchOptions)
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
    ```