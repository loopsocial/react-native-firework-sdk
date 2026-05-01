package com.loopnow.bogano;

import android.app.Application;
import android.content.Context;

import androidx.annotation.Nullable;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.firework.imageloading.glide.GlideImageLoaderFactory;
import com.firework.livestream.multihost.MultiHostLivestreamPlayerInitializer;
import com.firework.livestream.singlehost.SingleHostLivestreamPlayerInitializer;
import com.fireworksdk.bridge.models.FWSDKInitOptionsModel;
import com.fireworksdk.bridge.models.enums.FWPlayerLaunchBehavior;
import com.fireworksdk.bridge.reactnative.FWReactNativeSDK;
import com.fireworksdk.bridge.utils.FWGlobalDataUtil;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for FireworkSDKExample:
          return packages;
        }

        @Override
        public void clear() {
          super.clear();
          FWGlobalDataUtil.INSTANCE.setInitCompletedListener(null);
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Nullable
        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    // 初始化 SoLoader，使用了更完整的参数配置
    // 第一个参数：上下文
    // 第二个参数：是否从APK加载（false表示从系统路径加载）
//    SoLoader.init(this, /* native exopackage */ true);
    try {
      SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

//    // 优先加载 JSC 而不是 Hermes
//    try {
//      // 首先确保 JSC 相关类可以加载
//      Class.forName("com.facebook.react.jscexecutor.JSCExecutorFactory");
//
//      // 预先加载 JSC 相关库
//      SoLoader.loadLibrary("jsc");
//      SoLoader.loadLibrary("jscexecutor");
//
//      // 确认不加载 Hermes 相关库，避免冲突
//      // 这里通过防御性检查，确保没有意外加载 Hermes
//      if (BuildConfig.DEBUG) {
//        System.out.println("JSC initialized successfully, Hermes disabled.");
//      }
//    } catch (Exception e) {
//      e.printStackTrace();
//    }

//    // 处理新架构支持（如果启用）
//    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//      try {
//        // 通过反射加载新架构入口点
//        Class<?> entryPointClass = Class.forName("com.facebook.react.defaults.DefaultNewArchitectureEntryPoint");
//        entryPointClass.getMethod("load").invoke(null);
//      } catch (Exception e) {
//        e.printStackTrace();
//      }
//    }

    initializeFlipper(this, getReactNativeHost().getReactInstanceManager()); // Remove this line if you don't want Flipper enabled

    FWReactNativeSDK.INSTANCE.addLivestreamPlayerInitializer(new SingleHostLivestreamPlayerInitializer());
    FWReactNativeSDK.INSTANCE.addLivestreamPlayerInitializer(new MultiHostLivestreamPlayerInitializer());

    FWReactNativeSDK.INSTANCE.setImageLoader(GlideImageLoaderFactory.INSTANCE.createInstance(this));

    FWReactNativeSDK.INSTANCE.init(
      this,
      new FWSDKInitOptionsModel(FWPlayerLaunchBehavior.MuteOnFirstLaunch)
    );
  }

  @Override
  protected void attachBaseContext(Context base) {
    // Optional, setup language if you already have language setting in your app
    // FWReactNativeSDK.INSTANCE.changeLanguage("en", base);
    super.attachBaseContext(FWReactNativeSDK.INSTANCE.updateBaseContextLocale(base));
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.loopnow.bogano.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
