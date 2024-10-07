// JUDock.stories.tsx

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import JUDock, { JUDockProps } from './JUDock';
import { TiHomeOutline, TiThLargeOutline } from 'react-icons/ti';
import { AiOutlineUser } from 'react-icons/ai';
import { BsBook } from 'react-icons/bs';
import { FaRegEnvelope } from 'react-icons/fa';

// Exportation des métadonnées
const meta: Meta<JUDockProps> = {
    title: 'Components/JUDock',
    tags: ['autodocs'],
    component: JUDock,
    argTypes: {
        titles: {
            control: { type: 'object' }, // Changement ici pour permettre un contrôle
            description: 'Array of titles or objects with title and icon properties for the dock.',
            table: {
                type: { summary: 'Array<{ title: string, icon?: React.ReactNode }>' },
                defaultValue: { summary: '[]' },
            },
        },
        onClick: {
            action: 'clicked',
            description: 'Function called when a dock item is clicked.',
        },
        isCurrent: {
            description: 'Function to check if the title is currently active.',
            table: {
                type: { summary: '(title: string) => boolean' },
            },
        },
    },
};

export default meta;

// Exemple d'histoire de base
const Template: StoryFn<JUDockProps> = (args) => <JUDock {...args} />;

export const Default = Template.bind({});
Default.args = {
    titles: [
        { title: 'Home', icon: <TiHomeOutline /> },
        { title: 'About', icon: <AiOutlineUser /> },
        { title: 'Skills', icon: <BsBook /> },
        { title: 'Projects', icon: <TiThLargeOutline /> },
        { title: 'Contact', icon: <FaRegEnvelope /> },
    ],
    onClick: (title: string) => console.log(`${title} clicked`),
    isCurrent: (title: string) => title === 'Home',
};

// Documentation du composant
Default.parameters = {
    docs: {
        description: {
            component: `
                ## JUDock

                Le composant **JUDock** est un dock de navigation personnalisable qui permet de naviguer facilement entre différentes sections de votre application. 

                ### Propriétés

                - **titles**: \`Array<{ title: string, icon?: React.ReactNode }>\` - Une liste d'objets contenant le titre et l'icône à afficher.
                - **onClick**: \`(title: string) => void\` - Fonction appelée lorsqu'un élément du dock est cliqué.
                - **isCurrent**: \`(title: string) => boolean\` - Fonction utilisée pour vérifier si le titre est actuellement actif.

                ### Exemple d'utilisation

                \`\`\`tsx
                <JUDock
                    titles={[
                        { title: 'Home', icon: <TiHomeOutline /> },
                        { title: 'About', icon: <AiOutlineUser /> },
                        { title: 'Skills', icon: <BsBook /> },
                        { title: 'Projects', icon: <TiThLargeOutline /> },
                        { title: 'Contact', icon: <FaRegEnvelope /> },
                    ]}
                    onClick={(title) => console.log(\`\${title} clicked\`)}
                    isCurrent={(title) => title === 'Home'}
                />
                \`\`\`
            `,
        },
    },
};
