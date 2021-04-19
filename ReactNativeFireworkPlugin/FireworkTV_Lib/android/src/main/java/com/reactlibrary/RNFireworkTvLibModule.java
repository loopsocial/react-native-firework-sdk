
package com.reactlibrary;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.util.Log;

public class RNFireworkTvLibModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNFireworkTvLibModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNFireworkTvLib";
  }

  // @ReactMethod
  // public void open() {
  //     Log.d("ADebugTag", "Value: ");
  //     Intent intent = new Intent(getCurrentActivity(), FireworkActivity.class);
  //     getCurrentActivity().startActivity(intent);
  // }
}