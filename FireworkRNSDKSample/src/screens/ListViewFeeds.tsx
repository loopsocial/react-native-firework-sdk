import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
// @ts-expect-error — deprecated module with no type declarations
import ListView from 'deprecated-react-native-listview';
import { VideoFeed } from 'react-native-firework-sdk';
import { defaultShoppingPlaylist } from '../config/Feed.json';
import { useAppSelector } from '../hooks/reduxHooks';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ItemType =
  | 'feed'
  | 'heroBanner'
  | 'searchBar'
  | 'categoryRow'
  | 'promoBanner'
  | 'productGrid'
  | 'sectionTitle'
  | 'tallBanner'
  | 'featureCards'
  | 'lazyLoadSection';

type ListItem = {
  type: ItemType;
  key: string;
  channelId?: string;
  playlistId?: string;
  title?: string;
};

function VideoFeedItem({ item }: { item: ListItem }) {
  const enablePictureInPicture = useAppSelector(
    (state) => state.feed.enablePictureInPicture
  );
  const enableSystemPictureInPicture = useAppSelector(
    (state) => state.feed.enableSystemPictureInPicture
  );

  return (
    <View style={styles.feedWrapper}>
      <VideoFeed
        style={styles.feed}
        source={'playlist'}
        channel={item.channelId ?? ''}
        playlist={item.playlistId ?? ''}
        videoFeedConfiguration={{
          enableAutoplay: true,
        }}
        enablePictureInPicture={enablePictureInPicture}
        enableSystemPictureInPicture={enableSystemPictureInPicture}
      />
    </View>
  );
}

function HeroBanner() {
  return (
    <View style={styles.heroBanner}>
      <Text style={styles.bannerText}>Summer Sale</Text>
      <Text style={styles.bannerSubtext}>Up to 50% off selected items</Text>
    </View>
  );
}

function SearchBar() {
  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchText}>Search products...</Text>
    </View>
  );
}

function CategoryRow() {
  return (
    <View style={styles.categoryRow}>
      {['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'].map((cat) => (
        <View key={cat} style={styles.categoryItem}>
          <View style={styles.categoryIcon} />
          <Text style={styles.categoryLabel}>{cat}</Text>
        </View>
      ))}
    </View>
  );
}

function PromoBanner({ title }: { title: string }) {
  return (
    <View style={styles.promoBanner}>
      <Text style={styles.promoText}>{title}</Text>
    </View>
  );
}

function TallBanner({ title }: { title: string }) {
  return (
    <View style={styles.tallBanner}>
      <Text style={styles.tallBannerText}>{title}</Text>
      <Text style={styles.tallBannerSubtext}>
        Explore our curated collection
      </Text>
    </View>
  );
}

function ProductGrid({ title }: { title: string }) {
  return (
    <View style={styles.productGrid}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      <View style={styles.productRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.productCard}>
            <View style={styles.productImage} />
            <Text style={styles.productName}>Product {i}</Text>
            <Text style={styles.productPrice}>$99.99</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FeatureCards() {
  return (
    <View style={styles.featureCards}>
      {['Free Shipping', 'Easy Returns', '24/7 Support', 'Best Price'].map(
        (feature) => (
          <View key={feature} style={styles.featureCard}>
            <View style={styles.featureIcon} />
            <Text style={styles.featureLabel}>{feature}</Text>
          </View>
        )
      )}
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleWrapper}>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}

/**
 * Simulates a section that loads content asynchronously and expands in height.
 * Starts as a compact placeholder, then after a random delay (1-3s) expands
 * to show full content. This pushes everything below it down, including VideoFeed.
 */
function LazyLoadSection({ title }: { title: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const delay = 3000;
    const timer = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLoaded(true);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <View style={styles.lazyLoadPlaceholder}>
        <ActivityIndicator size="small" color="#999" />
        <Text style={styles.lazyLoadPlaceholderText}>Loading {title}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.lazyLoadExpanded}>
      <Text style={styles.lazyLoadTitle}>{title}</Text>
      <View style={styles.lazyLoadContent}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.lazyLoadCard}>
            <View style={styles.lazyLoadImage} />
            <Text style={styles.lazyLoadCardText}>Item {i}</Text>
            <Text style={styles.lazyLoadCardPrice}>$49.99</Text>
          </View>
        ))}
      </View>
      <View style={styles.lazyLoadContent}>
        {[5, 6, 7, 8].map((i) => (
          <View key={i} style={styles.lazyLoadCard}>
            <View style={styles.lazyLoadImage} />
            <Text style={styles.lazyLoadCardText}>Item {i}</Text>
            <Text style={styles.lazyLoadCardPrice}>$39.99</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Simulates the customer's ListView data:
 * Many content items above, VideoFeed placed far below (off-screen on initial load).
 * No StoryBlock — customer only uses VideoFeed.
 */
function buildListData(): ListItem[] {
  const items: ListItem[] = [];

  items.push({ type: 'heroBanner', key: 'hero-1' });
  items.push({ type: 'searchBar', key: 'search-1' });
  items.push({ type: 'categoryRow', key: 'category-1' });
  items.push({
    type: 'promoBanner',
    key: 'promo-1',
    title: 'Flash Sale - Up to 70% Off',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-1',
    title: 'Trending Products',
  });
  items.push({
    type: 'tallBanner',
    key: 'tall-1',
    title: 'New Season Collection',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-2',
    title: 'Recommended For You',
  });
  items.push({
    type: 'lazyLoadSection',
    key: 'lazy-1',
    title: 'Flash Deals',
  });
  items.push({ type: 'featureCards', key: 'features-1' });
  items.push({
    type: 'promoBanner',
    key: 'promo-2',
    title: 'Limited Edition Items',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-3',
    title: 'Best Sellers',
  });
  items.push({
    type: 'tallBanner',
    key: 'tall-2',
    title: 'Exclusive Deals',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-4',
    title: 'Popular This Week',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-2',
    title: 'Trending Products 2',
  });
  items.push({
    type: 'tallBanner',
    key: 'tall-2',
    title: 'New Season Collection 2',
  });
  items.push({
    type: 'promoBanner',
    key: 'promo-3',
    title: 'Members Only - Extra 20% Off',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-5',
    title: 'Recently Viewed',
  });

  // VideoFeed items — placed far down to simulate customer's layout
  // defaultHomeVideoFeedPlaylistInfoArray.forEach((vf, idx) => {
  //   items.push({
  //     type: 'sectionTitle',
  //     key: `vf-title-${idx}`,
  //     title: `This Week's Highlights ${idx + 1}`,
  //   });
  //   items.push({
  //     type: 'feed',
  //     key: `vf-${vf.channelId}-${vf.playlistId}`,
  //     channelId: vf.channelId,
  //     playlistId: vf.playlistId,
  //   });
  // });

  items.push({
    type: 'feed',
    key: `vf-${defaultShoppingPlaylist.channelId}-${defaultShoppingPlaylist.playlistId}`,
    channelId: defaultShoppingPlaylist.channelId,
    playlistId: defaultShoppingPlaylist.playlistId,
  });

  items.push({
    type: 'productGrid',
    key: 'grid-6',
    title: 'You May Also Like',
  });
  items.push({
    type: 'promoBanner',
    key: 'promo-4',
    title: 'Weekend Special Offers',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-7',
    title: 'Top Rated Products',
  });
  items.push({
    type: 'tallBanner',
    key: 'tall-3',
    title: 'Gift Guide 2026',
  });
  items.push({
    type: 'featureCards',
    key: 'features-2',
  });
  items.push({
    type: 'productGrid',
    key: 'grid-8',
    title: 'Clearance Sale',
  });

  return items;
}

function createDataSource(data: ListItem[]) {
  const ds = new ListView.DataSource({
    rowHasChanged: (r1: ListItem, r2: ListItem) => r1.key !== r2.key,
  });
  return ds.cloneWithRows(data);
}

function ListViewFeeds() {
  const listData = buildListData();
  const dataSource = useMemo(() => createDataSource(listData), [listData]);

  const renderRow = (
    _rowData: ListItem,
    _sectionId: string,
    _rowId: string
  ) => {
    const item = _rowData;
    switch (item.type) {
      case 'heroBanner':
        return <HeroBanner />;
      case 'searchBar':
        return <SearchBar />;
      case 'categoryRow':
        return <CategoryRow />;
      case 'promoBanner':
        return <PromoBanner title={item.title ?? ''} />;
      case 'tallBanner':
        return <TallBanner title={item.title ?? ''} />;
      case 'productGrid':
        return <ProductGrid title={item.title ?? ''} />;
      case 'featureCards':
        return <FeatureCards />;
      case 'lazyLoadSection':
        return <LazyLoadSection title={item.title ?? ''} />;
      case 'sectionTitle':
        return <SectionTitle title={item.title ?? ''} />;
      case 'feed':
        return <VideoFeedItem item={item} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ListView
        dataSource={dataSource}
        renderRow={renderRow}
        removeClippedSubviews={true}
        pageSize={5}
        initialListSize={10}
        scrollRenderAheadDistance={500}
        enableEmptySections={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  feedWrapper: {
    height: 300,
    margin: 10,
  },
  feed: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  heroBanner: {
    height: 200,
    margin: 10,
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  searchBar: {
    height: 44,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchText: {
    color: '#999',
    fontSize: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  promoBanner: {
    height: 100,
    margin: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tallBanner: {
    height: 180,
    margin: 10,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tallBannerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tallBannerSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 6,
  },
  productGrid: {
    margin: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  productName: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  productPrice: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: '#067be9',
  },
  featureCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 10,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D0E8FF',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitleWrapper: {
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 4,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  lazyLoadPlaceholder: {
    height: 60,
    margin: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  lazyLoadPlaceholderText: {
    color: '#999',
    fontSize: 13,
  },
  lazyLoadExpanded: {
    margin: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
  },
  lazyLoadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  lazyLoadContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lazyLoadCard: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
  },
  lazyLoadImage: {
    width: '100%',
    height: 60,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
  },
  lazyLoadCardText: {
    marginTop: 4,
    fontSize: 11,
    color: '#444',
  },
  lazyLoadCardPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E74C3C',
    marginTop: 2,
  },
});

export default ListViewFeeds;
