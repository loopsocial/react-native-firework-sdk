
# react-native-firework-tv-lib

### Manual installation

#### Android

# Configure Android Side
    * Follow this tutorial to get the Android SDK configuration: https://github.com/loopsocial/firework_sdk_official

	In order to open an Activity on React Native app you will need to setup the following:
	
	Create a java class at the same level that the MainActivity. This class will expose Java methods to be called in React Native.
	Change the "//your.android.app.bundle" to match the app bundle e.g.: "com.example". It can be found on MainActivity first line.
	Add this to the class:

    ``` java
		package //your.android.app.bundle;

		import android.app.Activity;
		import android.content.Intent;

		import com.facebook.react.ReactInstanceManager;
		import com.facebook.react.ReactNativeHost;
		import com.facebook.react.bridge.CatalystInstance;
		import com.facebook.react.bridge.ReactApplicationContext;
		import com.facebook.react.bridge.ReactContext;
		import com.facebook.react.bridge.ReactContextBaseJavaModule;
		import com.facebook.react.bridge.ReactMethod;
		import com.facebook.react.bridge.WritableNativeArray;

		/**
		* Methods annotated with {@link ReactMethod} are exposed.
		*/
		final class JavaModule extends ReactContextBaseJavaModule {

			ReactApplicationContext context = getReactApplicationContext();
			JavaModule(ReactApplicationContext reactContext) {
				super(reactContext);
			}

			@Override
			public String getName() {
				return "StarterModule";
			}

			@ReactMethod
			void navigateToNative() {
				Intent intent = new Intent(context, ExActivity.class);
				if (intent.resolveActivity(context.getPackageManager()) != null) {
					intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
					context.startActivity(intent);
				}
			}
		}
    ```

	Also, you will need to create a class that implements ReactPackage and add the package in your MainApplication, then all methods you want to expose will be visible to your React Native app.
	Create a class at the same level of MainActivity and add the following:

    ``` java
		package //your.android.app.bundle;

		import androidx.annotation.NonNull;

		import com.facebook.react.ReactPackage;
		import com.facebook.react.bridge.NativeModule;
		import com.facebook.react.bridge.ReactApplicationContext;
		import com.facebook.react.uimanager.ViewManager;

		import java.util.ArrayList;
		import java.util.Collections;
		import java.util.List;

		class JavaModuleReactPackage implements ReactPackage {
			@NonNull
			@Override
			public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
				List<NativeModule> modules = new ArrayList<>();
				modules.add(new JavaModuleReactPackage(reactContext));
				return modules;
			}

			@NonNull
			@Override
			public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
				return Collections.emptyList();
			}
		}
    ```

	After the ReactPackage is created, add it to the packages in MainApplication getPackages method:

    ``` java
		@Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          packages.add(new JavaModuleReactPackage());
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }
    ```

	Once the setup is done, now you have to create the Activity that will be presented when a button is pressed or some event happens.
	For this, create your Activity class and layout. In our case we want to present the Firework video feed, so here is an example:

	Class:

	``` java
		package //your.android.app.bundle;

		import android.os.Bundle;
		import android.view.View;
		import android.widget.TextView;
		import android.widget.Toast;

		import androidx.annotation.CallSuper;
		import androidx.annotation.Nullable;

		import com.facebook.react.ReactActivity;
		import com.facebook.react.ReactInstanceManager;
		import com.facebook.react.ReactNativeHost;
		import com.facebook.react.bridge.CatalystInstance;
		import com.facebook.react.bridge.ReactContext;
		import com.facebook.react.bridge.WritableNativeArray;

		public final class ExActivity extends ReactActivity {

			@Override
			@CallSuper
			protected void onCreate(@Nullable Bundle savedInstanceState) {
				super.onCreate(savedInstanceState);
				setContentView(R.layout.activity_firework);
			}
		}
    ```

    Then create in your layout folder a file named activity_firework.xml::

	``` xml
		<?xml version="1.0" encoding="utf-8"?>
		<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
			xmlns:app="http://schemas.android.com/apk/res-auto"
			xmlns:tools="http://schemas.android.com/tools"
			android:layout_width="match_parent"
			android:layout_height="match_parent"
			tools:context=".ExActivity">

			<com.loopnow.fireworklibrary.views.VideoFeedView
				android:layout_width="match_parent"
				android:layout_height="match_parent"
				app:showTitle="true"
				app:feedLayout="grid"
				app:columns="3"
				/>

		</androidx.constraintlayout.widget.ConstraintLayout>
	```

	Any Activity class created on Android needs to be on AndroidManifest.xml file, so add it this way:

	``` xml
		<activity android:name=".ExActivity"/>
	```

	Now that all Android side is configured, we will configure the iOS side. At the bottom of this README file there is the code for calling both Android and iOS native views.

# Configure iOS Side
    * Follow this tutorial to get the iOS SDK configuration: https://github.com/loopsocial/firework_ios_sdk


	Create in your App folder a Storyboard named Main and inside it create a ViewController, mark the "is initial View Controller" box and set the class and StoryboardId as ViewController, 
	mark the "Use Storyboard Id" box.
    Create in your App folder a ViewController then add the following code:

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

# Configuring the classes to call a ViewController in React Native

	Here we will do the same we did to Android, so we will have a class that will be called from React Native and we will already created the ViewController that will be presented.
	The class that will expose the methods to React Native can be created as following:

	StarterModule.h file:

	```objective-c
		#ifndef StarterModule_h
		#define StarterModule_h

		#import <React/RCTBridgeModule.h>

		@interface StarterModule : NSObject <RCTBridgeModule>

		@end

		#endif /* StarterModule_h */
	```

	StarterModule.m file:

	```objective-c
		#import <Foundation/Foundation.h>
		#import <UIKit/UIAlertController.h>
		#import <UIKit/UINavigationController.h>
		#import "StarterModule.h"
		#import "AppDelegate.h"

		@implementation StarterModule

		RCT_EXPORT_MODULE(StarterModule);

		RCT_EXPORT_METHOD(navigateToNative)
		{
			dispatch_async(dispatch_get_main_queue(), ^{
				AppDelegate *appDelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
				[appDelegate navigateToViewController];
			});
		}

		@end
	```

	The class that will call the ViewController is the AppDelegate, so configure it as following:

	AppDelegate.h file:

	```objective-c
		#import <React/RCTBridgeDelegate.h>
		#import <UIKit/UIKit.h>

		@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

		@property (nonatomic, strong) UIWindow *window;
		@property (nonatomic, strong) RCTBridge *reactBridge;

		- (void) navigateToViewController;

		@end
	```

    AppDelegate.m:
	Change [PROJECT_NAME] to match your iOS app name.

    ```objective-c
        @implementation AppDelegate

		UINavigationController *navigationController;

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
		{
		#ifdef FB_SONARKIT_ENABLED
			InitializeFlipper(application);
		#endif

			RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
			RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
															moduleName:@"[PROJECT_NAME]"
														initialProperties:nil];

			rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

			self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
			UIViewController *rootViewController = [UIViewController new];
			rootViewController.view = rootView;
			self.window.rootViewController = rootViewController;
			[self.window makeKeyAndVisible];
			return YES;
		}

		- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
		{
		#if DEBUG
			return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
		#else
			return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
		#endif
		}

		- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
		sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
		{
			return [RCTLinkingManager application:application openURL:url
							sourceApplication:sourceApplication annotation:annotation];
		}

		- (void) navigateToViewController
		{
			UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
			UIViewController *vc =[storyboard instantiateInitialViewController];
			[vc setModalPresentationStyle: UIModalPresentationFullScreen];
			[(UINavigationController*)self.window.rootViewController presentViewController:vc animated:YES completion:nil];
		}

		@end
    ```

# Calling the native views from React Native

	Now that iOS and Android are prepared to show a native view, we have to call it from React Native component.
	We will use the NativeModules to do it.

	Import NativeModules on your component:

	``` javascript
		import { NativeModules} from 'react-native';
	```

	Now use it as following:

	``` javascript
		NativeModules.StarterModule.navigateToNative();
	```

	This will trigger the native methods and call the native views. It can be used on the onPress method or anywhere else. 
	Notice that "navigateToNative" is the same on Android and iOS classes, so make sure to match them, as well as "StarterModule".