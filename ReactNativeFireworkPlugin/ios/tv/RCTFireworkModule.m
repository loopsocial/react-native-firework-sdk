#import "RCTFireworkModule.h"

@implementation RCTFireworkModule

RCT_EXPORT_METHOD (open) {
    console.log("Aqui eu abro a screen");
}

RCT_EXPORT_MODULE(FireworkIOS);

@end