import type { Meta, StoryObj } from '@storybook/angular';
import { MsRadioForm } from './ms-radio-form';

const meta: Meta<MsRadioForm> = {
  title: 'Design System/C. Molecules/RadioForm',
  component: MsRadioForm,
  parameters: {
    docs: {
      description: {
        component: `
# RadioForm Molecule

A vertical form component that combines a CellLabel (description text) at the top and a RadioCell (single radio + single chip) at the bottom, with a precise 2px gap between them.

## Features
- **Vertical Layout**: CellLabel on top, RadioCell on bottom
- **Precise Spacing**: 2px gap between components
- **Single Radio + Single Chip**: Simplified design with one radio button and one chip
- **4 Chip Variants**: Primary, Secondary, Tertiary, and Savings chips
- **Non-interactive Chips**: Chips display information with fixed icons
- **Surface Support**: Default, Light, and Dark surface variations
- **Text Truncation**: CellLabel truncates after specified character limit

## Component Structure
1. **Top**: CellLabel with descriptive text (can be truncated)
2. **2px Gap**: Precise spacing between components
3. **Bottom**: RadioCell with single radio button + single chip display

## When to Use
- Form sections with description + single radio selection + result display
- Configuration panels with explanatory text + single option + preview
- Settings with detailed descriptions + single choice + visual indicator
        `
      }
    },
    layout: 'centered'
  },
  argTypes: {
    labelText: { control: 'text' },
    labelMaxLength: { control: 'number' },
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
    disabled: { control: 'boolean' },
    surface: {
      control: 'select',
      options: ['default', 'light', 'dark']
    }
  }
};

export default meta;
type Story = StoryObj<MsRadioForm>;

export const Default: Story = {
  args: {
    labelText: 'Choose your preferred loan type and see the recommended term',
    radioOption: { value: 'conventional', label: 'Conventional Loan' },
    radioValue: 'conventional',
    radioName: 'loan-default',
    chipType: 'primary',
    chipData: { id: 1, label: '30 Year Fixed' }
  }
};

export const PrimaryChips: Story = {
  args: {
    labelText: 'Select your loan type and view the recommended term option',
    radioOption: { value: 'conventional', label: 'Conventional Loan' },
    radioValue: 'conventional',
    radioName: 'loan-primary',
    chipType: 'primary',
    chipData: { id: 1, label: '30 Year Fixed' }
  }
};

export const SecondaryChips: Story = {
  args: {
    labelText: 'Choose your application type and view your current status',
    radioOption: { value: 'new', label: 'New Application' },
    radioValue: 'new',
    radioName: 'app-secondary',
    chipType: 'secondary',
    chipData: { id: 1, label: 'Pre-approved' }
  }
};

export const TertiaryChips: Story = {
  args: {
    labelText: 'Select your rate preference and see the available feature',
    radioOption: { value: 'fixed', label: 'Fixed Rate' },
    radioValue: 'fixed',
    radioName: 'rate-tertiary',
    chipType: 'tertiary',
    chipData: { id: 1, label: 'Low Rate' }
  }
};

export const SavingsChip: Story = {
  args: {
    labelText: 'Choose your refinance option and see potential annual savings',
    radioOption: { value: 'rate-term', label: 'Rate & Term Refinance' },
    radioValue: 'rate-term',
    radioName: 'refinance-savings',
    chipType: 'savings',
    chipData: 'Save $3,200 annually',
    chipSavingsSize: 'm'
  }
};

export const WithLongDescription: Story = {
  args: {
    labelText: 'This is a comprehensive description that explains all the details about loan selection, terms, conditions, and benefits available for different loan types',
    radioOption: { value: 'fha', label: 'FHA Loan' },
    radioValue: 'fha',
    radioName: 'loan-long-desc',
    chipType: 'primary',
    chipData: { id: 1, label: '30 Year Fixed' }
  }
};

export const CustomTruncation: Story = {
  args: {
    labelText: 'This description will be truncated at 40 characters to demonstrate custom length control',
    labelMaxLength: 40,
    radioOption: { value: 'va', label: 'VA Loan' },
    radioValue: 'va',
    radioName: 'loan-truncated',
    chipType: 'savings',
    chipData: 'Save $1,800/year',
    chipSavingsSize: 's'
  }
};

export const Disabled: Story = {
  args: {
    labelText: 'This form section is currently disabled',
    radioOption: { value: 'conventional', label: 'Conventional Loan' },
    radioValue: 'conventional',
    radioName: 'loan-disabled',
    chipType: 'primary',
    chipData: { id: 1, label: '30 Year Fixed' },
    disabled: true
  }
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => ({
    template: `
      <div style="padding: 24px; display: grid; gap: 32px; font-family: Amalia; max-width: 600px;">
        <h2 style="margin: 0; font-size: 1.5rem; color: #2B2D33;">RadioForm - Description + Single Radio + Single Chip</h2>
        
        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Chip Type Variants</h3>
          <div style="display: grid; gap: 24px;">
            
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Primary Chips</h4>
              <ms-radio-form
                labelText="Select your loan type and see the recommended term option"
                [radioOption]="{ value: 'conv', label: 'Conventional Loan' }"
                radioValue="conv"
                radioName="primary-variant"
                chipType="primary"
                [chipData]="{ id: 1, label: '30 Year Fixed' }">
              </ms-radio-form>
            </div>

            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Secondary Chips</h4>
              <ms-radio-form
                labelText="Choose your application status to see what documents are complete"
                [radioOption]="{ value: 'approved', label: 'Pre-approved' }"
                radioValue="approved"
                radioName="secondary-variant"
                chipType="secondary"
                [chipData]="{ id: 1, label: 'Credit Verified' }">
              </ms-radio-form>
            </div>

            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Tertiary Chips</h4>
              <ms-radio-form
                labelText="Select your preferred rate option and see the available benefit"
                [radioOption]="{ value: 'points', label: 'Rate with Points' }"
                radioValue="points"
                radioName="tertiary-variant"
                chipType="tertiary"
                [chipData]="{ id: 1, label: 'Lowest Rate' }">
              </ms-radio-form>
            </div>

            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 1rem; color: #666;">Savings Chip</h4>
              <ms-radio-form
                labelText="Choose your refinance scenario and see potential savings based on current rates"
                [radioOption]="{ value: 'refinance', label: 'Refinance Current' }"
                radioValue="refinance"
                radioName="savings-variant"
                chipType="savings"
                chipData="Save $2,400 annually"
                chipSavingsSize="m">
              </ms-radio-form>
            </div>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Text Truncation Examples</h3>
          <div style="display: grid; gap: 24px;">
            
            <div style="background: #F8F6F2; padding: 16px; border-radius: 8px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">Default truncation (50 characters):</p>
              <ms-radio-form
                labelText="This is a very long description that will be truncated after fifty characters to demonstrate the default behavior in forms"
                [radioOption]="{ value: 'option1', label: 'Option 1' }"
                radioValue="option1"
                radioName="truncation-default"
                chipType="primary"
                [chipData]="{ id: 1, label: 'Selected' }">
              </ms-radio-form>
            </div>
            
            <div style="background: #F8F6F2; padding: 16px; border-radius: 8px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">Custom truncation (30 characters):</p>
              <ms-radio-form
                labelText="This description will be truncated at thirty characters to show custom behavior"
                [labelMaxLength]="30"
                [radioOption]="{ value: 'short1', label: 'Short Option' }"
                radioValue="short1"
                radioName="truncation-custom"
                chipType="savings"
                chipData="Save $1,200"
                chipSavingsSize="s">
              </ms-radio-form>
            </div>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Disabled State</h3>
          <ms-radio-form
            labelText="This form section is currently disabled due to system maintenance"
            [radioOption]="{ value: 'disabled1', label: 'Disabled Option' }"
            radioValue="disabled1"
            radioName="disabled-form"
            chipType="primary"
            [chipData]="{ id: 1, label: 'Unavailable' }"
            [disabled]="true">
          </ms-radio-form>
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
        <h2 style="margin: 0 0 24px 0; font-size: 1.5rem; color: #2B2D33;">RadioForm Component Documentation</h2>
        
        <section style="margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Component Structure</h3>
          <ul style="margin: 0; padding-left: 20px; color: #2B2D33; line-height: 1.6;">
            <li><strong>Top Layer:</strong> CellLabel with descriptive text (truncatable)</li>
            <li><strong>Spacing:</strong> 2px gap between components</li>
            <li><strong>Bottom Layer:</strong> RadioCell with single radio button + single chip display</li>
            <li><strong>Layout:</strong> Vertical flex layout with precise spacing</li>
          </ul>
        </section>

        <section style="margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Chip Variants Available</h3>
          <ul style="margin: 0; padding-left: 20px; color: #2B2D33; line-height: 1.6;">
            <li><strong>Primary:</strong> Main selection chip with primary styling</li>
            <li><strong>Secondary:</strong> Status or information chip with secondary styling</li>
            <li><strong>Tertiary:</strong> Additional details or features chip with tertiary styling</li>
            <li><strong>Savings:</strong> Special savings chip with success colors and custom text</li>
          </ul>
        </section>

        <section>
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #2B2D33;">Code Example</h3>
          <pre style="background: #F8F6F2; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 0; color: #2B2D33;"><code>// Single radio + primary chip
&lt;ms-radio-form
  labelText="Select your loan type and see the recommended term"
  [radioOption]="&#123; value: 'conventional', label: 'Conventional Loan' &#125;"
  radioValue="conventional"
  radioName="loan-selection"
  chipType="primary"
  [chipData]="&#123; id: 1, label: '30 Year Fixed' &#125;"
  (radioChange)="onLoanTypeChange($event)"&gt;
&lt;/ms-radio-form&gt;

// Single radio + savings chip
&lt;ms-radio-form
  labelText="Choose your refinance goal and see potential savings"
  [radioOption]="&#123; value: 'refinance', label: 'Refinance Current' &#125;"
  radioValue="refinance"
  radioName="refinance-goal"
  chipType="savings"
  chipData="Save $2,400 annually"
  chipSavingsSize="m"
  (radioChange)="onGoalChange($event)"&gt;
&lt;/ms-radio-form&gt;</code></pre>
        </section>
      </div>
    `
  })
}; 