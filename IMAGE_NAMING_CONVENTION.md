# Image Naming Convention for Website-for-non-reader

## Purpose
This document establishes a clear and consistent naming convention for all images used in the Website-for-non-reader project, ensuring easy identification, organization, and maintenance of visual assets.

## Naming Principles
- **Consistency**: Use the same structure and format across all image files
- **Clarity**: Filenames should clearly describe the image content
- **Simplicity**: Avoid overly complex or verbose names
- **Compatibility**: Use URL-safe characters and avoid special characters

## Naming Structure
```
images/[main-category]/[sub-category]/[item-name].[extension]
```

### Components

#### 1. Main Category
The top-level category that groups related images. Available main categories:

- **nature**: Images related to nature and the environment
- **daily-life**: Images of everyday objects and activities
- **people**: Images of people, relationships, and professions
- **objects**: Images of various objects and items
- **concepts**: Images representing abstract concepts and ideas
- **elements**: Images of natural elements and phenomena
- **science**: Images related to science, technology, and nature

#### 2. Sub-Category
A more specific category within the main category that further groups related images. Examples include:

- `nature/flowers/`
- `daily-life/kitchen/`
- `people/professionals/`
- `objects/sports/`
- `concepts/colors/`
- `elements/water/`
- `science/animals/`

#### 3. Item Name
A descriptive name for the specific image content. Follow these guidelines:

- Use lowercase letters only
- Separate words with hyphens (-)
- Be specific and concise
- Include relevant details that distinguish similar items

#### 4. File Extension
Use appropriate image formats:

- **PNG**: Preferred for images with transparency or simple graphics
- **JPG/JPEG**: Preferred for photographs or complex images with many colors
- **GIF**: Only for animated images

## Examples

### Valid Filenames
- `images/nature/flowers/rose.png`
- `images/daily-life/kitchen/toaster.jpg`
- `images/people/professionals/doctor.jpeg`
- `images/objects/sports/basketball.png`
- `images/concepts/colors/red.png`
- `images/elements/water/rain.png`
- `images/science/animals/dog.jpg`

### Invalid Filenames
- `images/Nature/Flowers/Rose.png` (Capital letters)
- `images/daily life/kitchen/toaster oven.jpg` (Spaces)
- `images/people/professionals/doctor123.png` (Non-descriptive)
- `images/objects/sports/bball.gif` (Abbreviations)
- `images/concepts/colors/color_red.png` (Redundant)

## Folder Structure
All images must be organized in the `images/` directory with a clear hierarchical structure:

```
images/
├── concepts/
│   ├── alphabet/
│   ├── colors/
│   ├── emotions/
│   ├── numbers/
│   ├── shapes/
│   └── time/
├── daily-life/
│   ├── appliances/
│   ├── bedroom/
│   ├── clothes/
│   ├── cooking/
│   ├── dishes/
│   ├── gadgets/
│   ├── kitchen/
│   ├── school/
│   ├── supplies/
│   └── tools/
├── elements/
│   ├── air/
│   ├── earth/
│   ├── fire/
│   ├── moon/
│   ├── rain/
│   ├── stars/
│   ├── sun/
│   ├── water/
│   └── wind/
├── nature/
│   ├── birds/
│   ├── clouds/
│   ├── fish/
│   ├── flowers/
│   ├── fruits/
│   ├── insects/
│   ├── ocean/
│   ├── plants/
│   ├── rainbow/
│   ├── trees/
│   └── vegetables/
├── objects/
│   ├── decorations/
│   ├── jewelry/
│   ├── musical-instruments/
│   ├── sports/
│   └── toys/
├── people/
│   ├── family/
│   ├── friends/
│   ├── neighbors/
│   └── professionals/
└── science/
    ├── animals/
    ├── body/
    ├── cells/
    ├── chemicals/
    ├── space/
    └── technology/
```

## Implementation Guidelines

### 1. Image Sourcing
- Use high-quality images with appropriate licenses
- Optimize images for web use to reduce file size
- Maintain consistent aspect ratios for similar types of images

### 2. HTML Implementation
When adding images to HTML files:

```html
<!-- Correct -->
<img src="images/nature/flowers/rose.png" alt="Red rose flower">

<!-- Incorrect -->
<img src="images/nature/flowers/rose 1.png" alt="Rose">
<img src="images/Nature/Flowers/rose.png" alt="Rose">
<img src="https://placehold.co/400x400" alt="Rose">
```

### 3. Maintenance
- Regularly audit image files to ensure they follow the convention
- Update filenames and paths if categories change
- Remove unused images to keep the repository clean

## Compliance
All new images added to the project must follow this convention. Existing images should be renamed and their references updated to comply with these guidelines.