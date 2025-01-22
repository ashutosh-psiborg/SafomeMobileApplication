#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [GMSServices provideAPIKey:@"AIzaSyBrsCdS1KEJ9QDOgnl5gwnemCuLJDKzp9Y"];
    return YES;
}

@interface AppDelegate : RCTAppDelegate

@end
