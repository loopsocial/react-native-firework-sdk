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
