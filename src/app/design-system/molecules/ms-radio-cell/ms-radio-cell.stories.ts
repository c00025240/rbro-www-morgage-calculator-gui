import type { Meta, StoryObj } from '@storybook/angular';
import { MsRadioCell } from './ms-radio-cell';

const meta: Meta<MsRadioCell> = {
  title: 'Design System/C. Molecules/RadioCell',
  component: MsRadioCell,
  parameters: {
    docs: {
      description: {
        component: `
# RadioCell Molecule

A cell component that combines a single radio button on the left with a single chip display on the right. Features non-interactive chips with fixed icons and proper typography colors.

## Features
- **Single Radio Button**: One radio option with proper text colors
- **Single Chip**: One chip with fixed checkmark and info icons
- **Non-interactive Chips**: Chips display information but don't respond to clicks
- **4 Chip Variants**: Primary, Secondary, Tertiary, or Savings
- **Surface Support**: Default, Light, and Dark surface variations
- **Typography Colors**: text-default (#2B2D33) on light, text-default (#FFFFFF) on dark

## Fixed Icons
- **Left Icon**: checkmark-ring Style=outlined.svg
- **Right Icon**: info Style=outlined.svg

## When to Use
- Simple form selections with visual result display
- Configuration options with single choice + preview
- Settings with radio choice + status indicator
        `
      }
    },
    layout: 'centered'
  },
  argTypes: {
    radioOption: { control: 'object' },
    radioValue: { control: 'text' },
    radioName: { control: 'text' },
    radioSize: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    chipType: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'savings']
    },
    chipData: { control: 'object' },
    chipSavingsSize: {
      control: 'select',
      options: ['s', 'm', 'l']
    },
    disabled: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<MsRadioCell>;

export const PrimaryChip: Story = {
  args: {
    radioOption: { value: 'conventional', label: 'Conventional Loan' },
    radioValue: 'conventional',
    radioName: 'loan-primary',
    chipType: 'primary',
    chipData: { id: 1, label: '30 Year Fixed' }
  }
};

export const SecondaryChip: Story = {
  args: {
    radioOption: { value: 'application', label: 'New Application' },
    radioValue: 'application',
    radioName: 'app-secondary',
    chipType: 'secondary',
    chipData: { id: 1, label: 'Pre-approved' }
  }
};

export const TertiaryChip: Story = {
  args: {
    radioOption: { value: 'rate', label: 'Fixed Rate' },
    radioValue: 'rate',
    radioName: 'rate-tertiary',
    chipType: 'tertiary',
    chipData: { id: 1, label: 'Low Rate' }
  }
};

export const SavingsChip: Story = {
  args: {
    radioOption: { value: 'refinance', label: 'Refinance' },
    radioValue: 'refinance',
    radioName: 'refi-savings',
    chipType: 'savings',
    chipData: 'Save $2,400/year',
    chipSavingsSize: 'm'
  }
};

export const Disabled: Story = {
  args: {
    radioOption: { value: 'disabled', label: 'Disabled Option' },
    radioValue: 'disabled',
    radioName: 'disabled-radio',
    chipType: 'primary',
    chipData: { id: 1, label: 'Unavailable' },
    disabled: true
  }
};

export const DarkSurface: Story = {
  name: 'Dark Surface',
  render: () => ({
    template: `
      <div style="background-color: #2B2D33; padding: 24px; border-radius: 8px;">
        <ms-radio-cell
          [radioOption]="{ value: 'dark-option', label: 'Dark Surface Option' }"
          radioValue="dark-option"
          radioName="dark-surface"
          chipType="primary"
          [chipData]="{ id: 1, label: 'Dark Theme' }"
          surface="dark">
        </ms-radio-cell>
      </div>
    `
  })
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => ({
    template: `
      <div style="padding: 24px; display: grid; gap: 24px; font-family: Amalia; max-width: 600px;">
        <h2 style="margin: 0; font-size: 1.5rem; color: #2B2D33;">RadioCell - Single Radio + Single Chip</h2>
        
        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Chip Variants</h3>
          <div style="display: grid; gap: 16px;">
            
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Primary Chip</h4>
              <ms-radio-cell
                [radioOption]="{ value: 'conv', label: 'Conventional Loan' }"
                radioValue="conv"
                radioName="primary-demo"
                chipType="primary"
                [chipData]="{ id: 1, label: '30 Year Fixed' }">
              </ms-radio-cell>
            </div>

            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Secondary Chip</h4>
              <ms-radio-cell
                [radioOption]="{ value: 'app', label: 'New Application' }"
                radioValue="app"
                radioName="secondary-demo"
                chipType="secondary"
                [chipData]="{ id: 1, label: 'Pre-approved' }">
              </ms-radio-cell>
            </div>

            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Tertiary Chip</h4>
              <ms-radio-cell
                [radioOption]="{ value: 'rate', label: 'Fixed Rate' }"
                radioValue="rate"
                radioName="tertiary-demo"
                chipType="tertiary"
                [chipData]="{ id: 1, label: 'Low Rate' }">
              </ms-radio-cell>
            </div>

            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Savings Chip</h4>
              <ms-radio-cell
                [radioOption]="{ value: 'refi', label: 'Refinance' }"
                radioValue="refi"
                radioName="savings-demo"
                chipType="savings"
                chipData="Save $2,400/year"
                chipSavingsSize="m">
              </ms-radio-cell>
            </div>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Surface Variations</h3>
          <div style="display: grid; gap: 16px;">
            
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Light Surface</h4>
              <ms-radio-cell
                [radioOption]="{ value: 'light', label: 'Light Surface' }"
                radioValue="light"
                radioName="light-demo"
                chipType="primary"
                [chipData]="{ id: 1, label: 'Light Theme' }"
                surface="light">
              </ms-radio-cell>
            </div>

            <div style="background: #2B2D33; padding: 16px; border-radius: 8px;">
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #ffffff;">Dark Surface</h4>
              <ms-radio-cell
                [radioOption]="{ value: 'dark', label: 'Dark Surface' }"
                radioValue="dark"
                radioName="dark-demo"
                chipType="primary"
                [chipData]="{ id: 1, label: 'Dark Theme' }"
                surface="dark">
              </ms-radio-cell>
            </div>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Real-world Examples</h3>
          <div style="display: grid; gap: 16px;">
            
            <ms-radio-cell
              [radioOption]="{ value: 'conventional', label: 'Conventional Loan' }"
              radioValue="conventional"
              radioName="mortgage-example"
              chipType="primary"
              [chipData]="{ id: 1, label: '30 Year Fixed' }">
            </ms-radio-cell>
            
            <ms-radio-cell
              [radioOption]="{ value: 'approved', label: 'Pre-approved Application' }"
              radioValue="approved"
              radioName="status-example"
              chipType="secondary"
              [chipData]="{ id: 1, label: 'Documents Complete' }">
            </ms-radio-cell>
            
            <ms-radio-cell
              [radioOption]="{ value: 'refinance', label: 'Refinance Current Loan' }"
              radioValue="refinance"
              radioName="savings-example"
              chipType="savings"
              chipData="Save $3,200 annually"
              chipSavingsSize="l">
            </ms-radio-cell>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Disabled State</h3>
          <ms-radio-cell
            [radioOption]="{ value: 'disabled', label: 'Disabled Option' }"
            radioValue="disabled"
            radioName="disabled-demo"
            chipType="primary"
            [chipData]="{ id: 1, label: 'Unavailable' }"
            [disabled]="true">
          </ms-radio-cell>
        </section>
      </div>
    `
  })
};

export const Documentation: Story = {
  name: 'Documentation',
  render: () => ({
    template: `
      <div style="padding: 24px; font-family: Amalia;">
        <h2 style="margin: 0 0 24px 0; font-size: 1.5rem; color: #2B2D33;">RadioCell Component Documentation</h2>
        
        <section style="margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Key Features</h3>
          <ul style="margin: 0; padding-left: 20px; color: #2B2D33; line-height: 1.6;">
            <li><strong>Single Radio:</strong> One radio button with proper typography colors</li>
            <li><strong>Single Chip:</strong> One chip with fixed checkmark + info icons</li>
            <li><strong>Non-interactive:</strong> Chips are display-only, no click/hover effects</li>
            <li><strong>4 Variants:</strong> Primary, Secondary, Tertiary, Savings chip types</li>
            <li><strong>Surface Support:</strong> Proper text colors for light/dark backgrounds</li>
          </ul>
        </section>

        <section style="margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Typography Colors</h3>
          <ul style="margin: 0; padding-left: 20px; color: #2B2D33; line-height: 1.6;">
            <li><strong>Light Surface:</strong> text-default (#2B2D33)</li>
            <li><strong>Dark Surface:</strong> text-default (#FFFFFF)</li>
          </ul>
        </section>

        <section style="margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Fixed Icons</h3>
          <ul style="margin: 0; padding-left: 20px; color: #2B2D33; line-height: 1.6;">
            <li><strong>Left Icon:</strong> checkmark-ring Style=outlined.svg</li>
            <li><strong>Right Icon:</strong> info Style=outlined.svg</li>
          </ul>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Code Example</h3>
          <pre style="background: #F8F6F2; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 0; color: #2B2D33;"><code>// Single radio + primary chip
&lt;ms-radio-cell
  [radioOption]="&#123; value: 'conventional', label: 'Conventional Loan' &#125;"
  radioValue="conventional"
  radioName="loan-type"
  chipType="primary"
  [chipData]="&#123; id: 1, label: '30 Year Fixed' &#125;"
  (radioChange)="onLoanTypeChange($event)"&gt;
&lt;/ms-radio-cell&gt;

// Single radio + savings chip
&lt;ms-radio-cell
  [radioOption]="&#123; value: 'refinance', label: 'Refinance' &#125;"
  radioValue="refinance"
  radioName="scenario"
  chipType="savings"
  chipData="Save $2,400/year"
  chipSavingsSize="m"
  (radioChange)="onScenarioChange($event)"&gt;
&lt;/ms-radio-cell&gt;</code></pre>
        </section>
      </div>
    `
  })
}; 