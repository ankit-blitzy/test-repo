/**
 * MenuPage – full menu browsing page with category navigation and item listing.
 */

import { MenuList } from '@/features/menu/components/MenuList';

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text">Our Menu</h1>
        <p className="mt-2 text-text-light">Browse our full selection of hand-crafted burgers, sides, and drinks.</p>
      </div>
      <MenuList />
    </div>
  );
}
