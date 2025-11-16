# Button Component Examples

## Basic Usage

### Default Button (Filled variant, left icon)

```tsx
<Button label="Save Changes" to="/save" icon={<IconDeviceFloppy />} />
```

### Outlined Button

```tsx
<Button label="Cancel" to="/cancel" variant="outlined" />
```

### Text Button

```tsx
<Button label="Learn More" to="/learn" variant="text" />
```

### Unstyled Button (variant="none")

```tsx
<Button
  label="Custom"
  to="/custom"
  variant="none"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600"
/>
```

## Icon Positioning

### Icon on Right

```tsx
<Button
  label="Next Step"
  to="/next"
  icon={<IconArrowRight />}
  iconPosition="right"
/>
```

### Icons on Both Sides (Same Icon)

```tsx
<Button
  label="Important"
  to="/important"
  icon={<IconStar />}
  iconPosition="both"
/>
```

### Icons on Both Sides (Different Icons)

```tsx
<Button
  label="Transfer"
  to="/transfer"
  icon={<IconDownload />}
  iconRight={<IconUpload />}
  iconPosition="both"
/>
```

## Icon Hover Colors

### Custom Hover Color (Success Green)

```tsx
<Button
  label="Approve"
  to="/approve"
  icon={<IconCheck />}
  iconHoverColor="#10b981"
  variant="outlined"
/>
```

### Custom Hover Color (Error Red)

```tsx
<Button
  label="Delete"
  to="/delete"
  icon={<IconTrash />}
  iconHoverColor="#ef4444"
  variant="outlined"
/>
```

### Custom Hover Color (Info Blue)

```tsx
<Button
  label="View Details"
  to="/details"
  icon={<IconEye />}
  iconHoverColor="#3b82f6"
/>
```

## Custom Styling with className

### Override Background and Hover Colors

```tsx
<Button
  label="Custom Colors"
  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-xl"
  icon={<IconSparkles />}
/>
```

### Override Everything with variant="none"

```tsx
<Button
  label="Fully Custom"
  variant="none"
  className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 border-2 border-white shadow-2xl transform hover:scale-105"
  icon={<IconRocket />}
/>
```

### Custom Padding and Size

```tsx
<Button
  label="Large Button"
  className="px-8 py-4 text-lg"
  icon={<IconSparkles />}
/>
```

### Custom Text and Hover Colors

```tsx
<Button
  label="Purple Gradient"
  className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
  variant="outlined"
/>
```

### Icon Hover with Custom Class

```tsx
<Button
  label="Custom Icon Hover"
  icon={<IconStar />}
  iconClassName="group-hover:[&>svg]:text-yellow-400 group-hover:[&>svg]:rotate-12"
  variant="outlined"
/>
```

## Border Radius Options

```tsx
<Button label="Sharp" radius="none" />
<Button label="Small" radius="sm" />
<Button label="Medium" radius="md" /> {/* default */}
<Button label="Large" radius="lg" />
<Button label="Extra Large" radius="xl" />
<Button label="Pill" radius="full" />
```

## With Click Handler

```tsx
<Button
  label="Submit Form"
  onClick={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  icon={<IconSend />}
  iconPosition="right"
/>
```

## Available Props

| Prop             | Type                                                         | Default    | Description                                                  |
| ---------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| `label`          | `string`                                                     | -          | Button text (required)                                       |
| `to`             | `string`                                                     | `"#"`      | Navigation path                                              |
| `variant`        | `"filled"` \| `"outlined"` \| `"text"` \| `"none"`           | `"filled"` | Button style variant                                         |
| `icon`           | `ReactNode`                                                  | -          | Icon for left side (or both sides if iconRight not provided) |
| `iconRight`      | `ReactNode`                                                  | -          | Icon specifically for right side                             |
| `iconPosition`   | `"left"` \| `"right"` \| `"both"`                            | `"left"`   | Where to display icons                                       |
| `iconHoverColor` | `string`                                                     | -          | Custom color for icon on hover (any valid CSS color)         |
| `iconClassName`  | `string`                                                     | `""`       | Custom CSS classes for icon wrapper (merged with defaults)   |
| `radius`         | `"none"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"full"` | `"md"`     | Border radius size                                           |
| `className`      | `string`                                                     | `""`       | Custom CSS classes (merged with defaults, highest priority)  |
| `onClick`        | `function`                                                   | -          | Click handler                                                |

## Notes

- **className Priority**: Custom `className` prop has the highest priority and can override any default styles
- **Variant "none"**: Use `variant="none"` for fully custom buttons without any default styles
- **CSS Merge**: Uses `cn()` utility (clsx + tailwind-merge) to intelligently merge classes
- **Icon hover colors**: Support both CSS custom properties (iconHoverColor) and Tailwind classes (iconClassName)
- Icons are sized to 20x20 pixels (w-5 h-5) by default, can be overridden with iconClassName
- All transitions are smooth (200ms duration)

## Advanced Examples

### Gradient Button with Custom Icon Animation

```tsx
<Button
  label="Sparkle Magic"
  variant="none"
  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-6 py-3 rounded-lg hover:shadow-2xl hover:scale-105 transition-all"
  icon={<IconSparkles />}
  iconClassName="group-hover:[&>svg]:animate-spin group-hover:[&>svg]:text-yellow-300"
/>
```

### Different Icons with Different Hover Colors

```tsx
<Button
  label="Transfer"
  icon={<IconDownload />}
  iconRight={<IconUpload />}
  iconPosition="both"
  iconClassName="group-hover:[&>svg]:first:text-green-500 group-hover:[&>svg]:last:text-blue-500"
  variant="outlined"
/>
```

### Responsive Button

```tsx
<Button
  label="Responsive"
  className="px-2 py-1 text-sm md:px-6 md:py-3 md:text-base"
  icon={<IconDevices />}
/>
```

### Success/Error States

```tsx
{
  /* Success */
}
<Button
  label="Success"
  className="bg-green-600 hover:bg-green-700"
  icon={<IconCheck />}
/>;

{
  /* Error */
}
<Button
  label="Error"
  className="bg-red-600 hover:bg-red-700"
  icon={<IconX />}
/>;

{
  /* Warning */
}
<Button
  label="Warning"
  className="bg-yellow-600 hover:bg-yellow-700"
  icon={<IconAlertTriangle />}
/>;
```
