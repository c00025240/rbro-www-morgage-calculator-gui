import type { Meta } from '@storybook/angular';
import { MsSelect } from './ms-select';
import { Default as DefaultFromNew } from './ms-select.stories';

const meta: Meta<MsSelect> = {
  title: 'Design System/A. Atoms/Select',
  component: MsSelect,
};
export default meta;

// Alias the default story so the old URL continues to work
export const Default = DefaultFromNew; 