import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
  } from '@mui/material';
  import { sanitizeText } from '@/common/utills/helpers/sanitize';
  import type { WizardFieldRendererProps } from './fieldRenderer.d';
  import './fieldRenderer.scss';
  
  export function FieldRenderer({ field, value, error, onChange, onBlur }: WizardFieldRendererProps) {
    const errorId = `${field.name}-error`;
    const describedBy = error ? errorId : undefined;
  
    const commonProps = {
      id: field.name,
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      error: Boolean(error),
      'aria-invalid': Boolean(error),
      'aria-describedby': describedBy,
      onBlur: () => onBlur?.(field.name),
      fullWidth: true,
    };
  
    let control: JSX.Element;
  
    switch (field.type) {
      case 'select':
        control = (
          <TextField
            {...commonProps}
            select
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, sanitizeText(e.target.value))}
          >
            {field.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        );
        break;
      case 'checkbox':
        control = (
          <FormControlLabel
            control={
              <Checkbox
                id={field.name}
                checked={Boolean(value)}
                onChange={(e) => onChange(field.name, e.target.checked)}
                onBlur={() => onBlur?.(field.name)}
                inputProps={{ 'aria-invalid': Boolean(error), 'aria-describedby': describedBy }}
              />
            }
            label={field.label}
          />
        );
        break;
      case 'radio':
        control = (
          <div role="group" aria-labelledby={`${field.name}-label`} aria-describedby={describedBy}>
            <FormLabel id={`${field.name}-label`}>{field.label}</FormLabel>
            <RadioGroup
              value={(value as string) ?? ''}
              onChange={(e) => onChange(field.name, sanitizeText(e.target.value))}
            >
              {field.options?.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
          </div>
        );
        break;
      case 'textarea':
        control = (
          <TextField
            {...commonProps}
            multiline
            minRows={3}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, sanitizeText(e.target.value))}
          />
        );
        break;
      case 'number':
        control = (
          <TextField
            {...commonProps}
            type="number"
            value={(value as number) ?? ''}
            onChange={(e) => onChange(field.name, Number(e.target.value))}
          />
        );
        break;
      case 'password':
        control = (
          <TextField
            {...commonProps}
            type="password"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
        break;
      case 'date':
        control = (
          <TextField
            {...commonProps}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, sanitizeText(e.target.value))}
          />
        );
        break;
      case 'email':
      case 'text':
      default:
        control = (
          <TextField
            {...commonProps}
            type={field.type === 'email' ? 'email' : 'text'}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, sanitizeText(e.target.value))}
          />
        );
        break;
    }
  
    return (
      <div className="field-renderer">
        {control}
        {error && (
          <span id={errorId} role="alert" className="wizard__error">
            {error}
          </span>
        )}
      </div>
    );
  }
  
  export default FieldRenderer;
  