package com.loopnow.bogano;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.fireworksdk.bridge.reactnative.FWReactNativeSDK;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FireworkSDKExample"; // FireworkSDKExample FWShoppingCartPage
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
}
