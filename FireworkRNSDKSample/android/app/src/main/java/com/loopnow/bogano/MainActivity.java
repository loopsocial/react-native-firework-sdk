package com.loopnow.bogano;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.fireworksdk.bridge.reactnative.FWReactNativeSDK;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import java.util.Objects;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FireworkSdkExample"; // FireworkSDKExample FWShoppingCartPage
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(this, Objects.requireNonNull(getMainComponentName()), DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  @Override
  protected void attachBaseContext(Context newBase) {
    super.attachBaseContext(FWReactNativeSDK.INSTANCE.updateBaseContextLocale(newBase));
  }

  @Override
  public void onBackPressed() {
    super.onBackPressed();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    // for android 11
    FWReactNativeSDK.INSTANCE.closePip();
  }
}
