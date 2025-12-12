import { useAuth0 } from "@auth0/auth0-react";
import { Disclosure, DisclosureButton, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import type React from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { usePermissions } from "../hooks/usePermissions";
import LoginButton from "./buttons/auth/LoginButton";
import LogoutButton from "./buttons/auth/LogoutButton";

interface NavBarProps {
	headerLogo?: string;
	headerTitle?: string;
}

const NavBar: React.FC<NavBarProps> = ({
	headerLogo,
	headerTitle = "RSSA Dashboard",
}) => {
	const { user, isAuthenticated } = useAuth0();

	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }) => (
				<>
					<div className="mx-auto px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								<DisclosureButton
									className={`relative inline-flex items-center 
									justify-center rounded-md p-2 text-gray-400
									hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 
									focus:ring-inset focus:ring-white
								`}>
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</DisclosureButton>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Link to={"/"} className="flex items-center space-x-3 rtl:space-x-reverse">
										<div>
											<div>
												{headerLogo &&
													<img src={headerLogo} className="h-8" alt="Flowbite Logo" />
												}
												{headerTitle &&
													<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
														{headerTitle}
													</span>
												}
											</div>
										</div>
									</Link>
								</div>
							</div>
							<NavLink destination="/studies">
								Studies
							</NavLink>
							<NavLink destination="/constructs" permission="read:constructs">
								Construct Library
							</NavLink>
							<NavLink destination="/scales" permission="read:scales">
								Scales
							</NavLink>
							<NavLink destination="/movies" permission="read:movies">
								Movies
							</NavLink>
							<div className={clsx(
								"absolute", "inset-y-0 right-0 flex items-center pr-2",
								"sm:static sm:inset-auto sm:ml-6 sm:pr-0")}>
								{isAuthenticated && user ? (
									// Profile dropdown
									<Menu as="div" className="relative ml-3">
										<div>
											<MenuButton
												className={`relative flex  
													focus:outline-none focus:ring-2 focus:ring-white
													cursor-pointer
													focus:ring-offset-2 focus:ring-offset-gray-800`}>
												<span className="absolute -inset-1.5" />
												<span className="sr-only">Open user menu</span>
												<img
													className={`
														size-13 
														rounded 
														border border-gray-300 dark:border-gray-200 
														border-solid border-2
													`}
													src={user.picture}
													alt="Profile picture"
												/>
											</MenuButton>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95">
											<MenuItems className={`
												absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md 
												bg-white py-0 shadow-lg ring-1 ring-black ring-opacity-5 
												focus:outline-none
											`}>
												<MenuItem>
													<Link to="/profile"
														className={clsx(
															'text-gray-300',
															'hover:bg-gray-700',
															'hover:text-white rounded-md',
															'px-3 py-3 text-sm font-medium',
															'm-0',
															'text-center',
															'cursor-pointer',
															'block',
															'w-full',
															'text-sm text-gray-700'
														)}>
														Your Profile
													</Link>
												</MenuItem>
												<MenuItem>
													<LogoutButton />
												</MenuItem>
											</MenuItems>
										</Transition>
									</Menu>
								) : (
									<LoginButton />
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</Disclosure>
	);
};

interface NavLinkProps {
	destination: string;
	permission?: string;
	children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({
	destination,
	permission,
	children
}) => {
	const { hasPermission } = usePermissions();

	if (permission && !hasPermission(permission)) {
		return <></>;
	}

	return (
		<div className={clsx(
			"absolute", "inset-y-0 right-0 flex items-center pr-2",
			"sm:static sm:inset-auto sm:ml-6 sm:pr-0")}>
			<Link to={destination}
				className={clsx(
					"block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent",
					"md:text-white-700 md:p-0 md:dark:text-white-700 dark:bg-white-700",
					"md:dark:bg-transparent"
				)}
				aria-current="page">
				{children}
			</Link>
		</div>
	);
}

export default NavBar;
