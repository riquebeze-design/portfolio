import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Briefcase, Users, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { MadeWithDyad } from './made-with-dyad';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Trabalhos', path: '/admin/works', icon: Briefcase },
    { name: 'Leads', path: '/admin/leads', icon: Users },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 bg-sidebar-background text-sidebar-foreground rounded-r-lg shadow-lg">
      <div className="mb-8">
        <Link to="/admin" className="text-2xl font-bold text-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
          Admin Panel
        </Link>
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            asChild
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg px-4 py-3 transition-colors"
          >
            <Link to={item.path}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
      <Separator className="bg-sidebar-border my-4" />
      <Button
        onClick={logout}
        variant="destructive"
        className="w-full justify-start rounded-lg px-4 py-3 transition-colors"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
      <div className="mt-auto pt-4">
        <MadeWithDyad />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-black text-foreground"> {/* Adicionado bg-black aqui */}
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-white rounded-full shadow-md dark:bg-gray-900">
              <Menu className="h-6 w-6 text-purple-700 dark:text-purple-400" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="w-64 flex-shrink-0 border-r border-sidebar-border">
          <SidebarContent />
        </aside>
      )}

      <div className="flex-grow flex flex-col">
        <header className="w-full bg-black shadow-sm p-4 flex items-center justify-between sticky top-0 z-40 rounded-b-lg"> {/* Alterado para bg-black */}
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1> {/* Alterado para text-white */}
          {!isMobile && (
            <Button onClick={logout} variant="destructive" className="rounded-full px-6 py-3">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </header>
        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;