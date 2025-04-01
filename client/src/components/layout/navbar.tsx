import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Car, Menu, User, MapPin, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <Car className="text-primary h-6 w-6 mr-2" />
                  <span className="text-xl font-bold text-primary">TripSync</span>
                </a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a
                  className={`${
                    isActive("/")
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Home
                </a>
              </Link>
              <Link href="/how-it-works">
                <a
                  className={`${
                    isActive("/how-it-works")
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  How It Works
                </a>
              </Link>
              <Link href="/universities">
                <a
                  className={`${
                    isActive("/universities")
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Universities
                </a>
              </Link>
              <Link href="/safety">
                <a
                  className={`${
                    isActive("/safety")
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Safety
                </a>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/find-ride">
                  <Button variant="outline" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find a Ride
                  </Button>
                </Link>
                <Link href="/offer-ride">
                  <Button variant="default" className="flex items-center">
                    <Car className="mr-2 h-4 w-4" />
                    Offer a Ride
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.fullName} />
                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <a className="flex cursor-pointer items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <a className="flex cursor-pointer items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </a>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="px-4 py-2 text-sm font-medium text-primary border border-primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="default" className="px-4 py-2 text-sm font-medium text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center mb-4">
                      <Car className="text-primary h-6 w-6 mr-2" />
                      <span className="text-xl font-bold text-primary">TripSync</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="pt-2 pb-3 space-y-1">
                  <Link href="/">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        isActive("/")
                          ? "bg-primary-50 border-primary text-primary-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/how-it-works">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        isActive("/how-it-works")
                          ? "bg-primary-50 border-primary text-primary-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    >
                      How It Works
                    </a>
                  </Link>
                  <Link href="/universities">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        isActive("/universities")
                          ? "bg-primary-50 border-primary text-primary-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    >
                      Universities
                    </a>
                  </Link>
                  <Link href="/safety">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        isActive("/safety")
                          ? "bg-primary-50 border-primary text-primary-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    >
                      Safety
                    </a>
                  </Link>
                </div>
                {user ? (
                  <>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                      <div className="flex items-center px-4 py-2">
                        <div className="flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profileImage} alt={user.fullName} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                          <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <Link href="/dashboard">
                          <a
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                          >
                            Dashboard
                          </a>
                        </Link>
                        <Link href="/profile">
                          <a
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                          >
                            Profile
                          </a>
                        </Link>
                        <Link href="/find-ride">
                          <a
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                          >
                            Find a Ride
                          </a>
                        </Link>
                        <Link href="/offer-ride">
                          <a
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                          >
                            Offer a Ride
                          </a>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4 space-x-3">
                      <Link href="/auth" className="flex-1">
                        <Button
                          onClick={() => setMobileMenuOpen(false)}
                          variant="outline"
                          className="w-full"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth" className="flex-1">
                        <Button
                          onClick={() => setMobileMenuOpen(false)}
                          variant="default"
                          className="w-full"
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
