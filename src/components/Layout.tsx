import { Outlet, Link, useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import useAppStore from '@/stores/useAppStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Home,
  MapPin,
  Package,
  User as UserIcon,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronLeft,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Layout() {
  const isMobile = useIsMobile()
  const { currentUser, logout } = useAppStore()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isAdmin = currentUser?.role === 'admin'

  const NavItem = ({ to, icon: Icon, label, active }: any) => (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )

  const MobileTab = ({ to, icon: Icon, label, active }: any) => (
    <Link
      to={to}
      className={cn(
        'flex flex-col items-center justify-center flex-1 py-3 gap-1 transition-colors',
        active ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      <Icon
        className={cn('w-6 h-6 transition-transform', active && 'scale-110')}
      />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 border-r border-border bg-card fixed h-screen z-40 hidden md:flex flex-col p-4 shadow-sm">
          <div className="flex items-center gap-2 px-2 mb-8 mt-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SwiftRide</span>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem
              to="/"
              icon={Home}
              label="Início"
              active={location.pathname === '/'}
            />
            <NavItem
              to="/bookings"
              icon={MapPin}
              label="Minhas Viagens"
              active={location.pathname === '/bookings'}
            />
            <NavItem
              to="/deliveries"
              icon={Package}
              label="Entregas"
              active={location.pathname === '/deliveries'}
            />
            {isAdmin && (
              <NavItem
                to="/admin"
                icon={Settings}
                label="Painel Admin"
                active={location.pathname.startsWith('/admin')}
              />
            )}
          </nav>

          <div className="mt-auto pt-4 border-t border-border">
            {currentUser ? (
              <div className="flex items-center gap-3 px-2">
                <Avatar>
                  <AvatarImage src={currentUser.avatarUrl} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            ) : (
              <Button asChild className="w-full" variant="outline">
                <Link to="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all',
          !isMobile && 'md:ml-64',
        )}
      >
        {/* Top Navbar */}
        <header className="glass-nav h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            {isMobile && isHome && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-lg">SwiftRide</span>
              </div>
            )}

            {!isMobile && (
              <div className="relative w-96 hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Para onde você quer ir?"
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary/50 border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border border-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src={currentUser?.avatarUrl} />
                    <AvatarFallback>
                      {currentUser?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bookings">
                    <MapPin className="w-4 h-4 mr-2" />
                    Minhas Viagens
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <Outlet />
        </div>

        {/* Footer (Desktop Only) */}
        {!isMobile && (
          <footer className="p-8 border-t border-border mt-auto bg-card text-muted-foreground text-sm">
            <div className="flex justify-between items-center max-w-5xl mx-auto">
              <p>© 2024 SwiftRide. Todos os direitos reservados.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary">
                  Termos
                </a>
                <a href="#" className="hover:text-primary">
                  Privacidade
                </a>
                <a href="#" className="hover:text-primary">
                  Ajuda
                </a>
              </div>
            </div>
          </footer>
        )}

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex z-50 pb-safe">
            <MobileTab
              to="/"
              icon={Home}
              label="Início"
              active={location.pathname === '/'}
            />
            <MobileTab
              to="/bookings"
              icon={MapPin}
              label="Viagens"
              active={location.pathname === '/bookings'}
            />
            <MobileTab
              to="/deliveries"
              icon={Package}
              label="Entregas"
              active={location.pathname === '/deliveries'}
            />
            <MobileTab
              to="/profile"
              icon={UserIcon}
              label="Perfil"
              active={location.pathname === '/profile'}
            />
          </div>
        )}
      </main>
    </div>
  )
}
