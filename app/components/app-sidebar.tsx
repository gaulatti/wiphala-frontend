import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart, SquareTerminal } from 'lucide-react';
import * as React from 'react';
import { NavLink } from 'react-router';

import styled from '@emotion/styled';
import { NavMain } from '~/components/nav-main';
import { NavProjects } from '~/components/nav-projects';
import { NavUser } from '~/components/nav-user';
import { TeamSwitcher } from '~/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from '~/components/ui/sidebar';

/**
 * A styled component that represents the logo in the sidebar.
 * It is based on the `NavLink` component and has specific styles applied to it.
 *
 * Styles applied:
 * - Height: 66px
 * - Display: inline-block
 * - Padding-right: 1rem
 * - Line-height: 66px
 * - Font-size: 2rem
 * - Text-align: center
 * - Font-family: 'Comodo', sans-serif
 */
const Logo = styled(NavLink)`
  height: 66px;
  display: inline-block;
  padding-right: 1rem;
  line-height: 66px;
  font-size: 2rem;
  text-align: center;
  font-family: 'Comodo', sans-serif;
`;


// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playlists',
      url: '/playlists',
      icon: SquareTerminal,
      isActive: true,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        {state !== 'collapsed' && <Logo to='/'>wiphala</Logo>}
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
