import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { BsBook } from 'react-icons/bs';
import { FaRegEnvelope } from 'react-icons/fa';
import { TiHomeOutline, TiThLargeOutline } from 'react-icons/ti';

// Définition des types pour le Dock
interface DockItem {
  title: string;
  icon: React.ReactNode;
}

interface JUDockProps {
  titles: DockItem[];
  onClick: (title: string) => void;
  isCurrent: (title: string) => boolean;
}

// Composant JUDock
const JUDock: React.FC<JUDockProps> = ({ titles, onClick, isCurrent }) => {
  return (
    <nav>
      {titles.map((item) => (
        <a
          href="#"
          key={item.title}
          onClick={() => onClick(item.title)}
          className={isCurrent(item.title) ? 'active' : ''}
        >
          {item.icon}
          {item.title}
        </a>
      ))}
    </nav>
  );
};

// Tests pour le composant JUDock
describe('JUDock', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    render(
      <JUDock 
        titles={[
          { title: 'Home', icon: <TiHomeOutline /> },
          { title: 'About Me', icon: <AiOutlineUser /> },
          { title: 'My Skills', icon: <BsBook /> },
          { title: 'Projects', icon: <TiThLargeOutline /> },
          { title: 'Contact', icon: <FaRegEnvelope /> },
        ]}
        onClick={mockOnClick}
        isCurrent={(title) => title === "Home"}
      />
    );
  });

  it('renders the dock with titles', () => {
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[1]).toHaveTextContent('About Me');
    expect(links[2]).toHaveTextContent('My Skills');
    expect(links[3]).toHaveTextContent('Projects');
    expect(links[4]).toHaveTextContent('Contact');
  });

  it('highlights the active link', () => {
    const activeLink = screen.getByText('Home');
    expect(activeLink).toHaveClass('active');
  });

  it('calls onClick when a link is clicked', () => {
    const aboutLink = screen.getByText('About Me');
    fireEvent.click(aboutLink);
    expect(mockOnClick).toHaveBeenCalledWith('About Me');
  });
});
