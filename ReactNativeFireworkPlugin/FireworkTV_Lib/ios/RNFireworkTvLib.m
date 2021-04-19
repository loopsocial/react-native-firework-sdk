//
//#import "RNFireworkTvLib.h"
//
//@implementation RNFireworkTvLib
//
//- (dispatch_queue_t)methodQueue
//{
//    return dispatch_get_main_queue();
//}
//RCT_EXPORT_MODULE()
//
//@end
//

#import "RNFireworkTvLib.h"

@implementation RNFireworkTvLib

RCT_EXPORT_METHOD (open) {
  NSLog(@"words");
}

RCT_EXPORT_MODULE(FireworkIOS);

@end
