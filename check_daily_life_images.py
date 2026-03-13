import os
import re

def main():
    html_file = "knowing/daily-life.html"
    image_base_dir = "images/daily-life"
    
    # Read the HTML file
    with open(html_file, 'r') as f:
        html_content = f.read()
    
    # Extract all img src attributes
    img_pattern = r'src="([^"]+)"'
    src_list = re.findall(img_pattern, html_content)
    
    # Filter out non-image sources and focus on images/daily-life paths
    daily_life_images = []
    for src in src_list:
        if "../images/daily-life/" in src:
            # Convert to relative path from project root
            relative_path = src.replace("../", "")
            daily_life_images.append(relative_path)
    
    print(f"Found {len(daily_life_images)} image references in daily-life.html")
    
    # Get all actual image files in images/daily-life directory
    actual_images = []
    for root, _, files in os.walk(image_base_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                # Get relative path from project root
                relative_path = os.path.join(root, file)
                actual_images.append(relative_path)
    
    print(f"Found {len(actual_images)} actual image files in {image_base_dir} directory")
    
    # Check for missing images
    missing_images = []
    for img_path in daily_life_images:
        if img_path not in actual_images:
            missing_images.append(img_path)
    
    # Report results
    print("\n=== Image Check Report ===")
    if missing_images:
        print(f"\n❌ Missing Images ({len(missing_images)}):")
        for img in missing_images:
            print(f"  - {img}")
    else:
        print("\n✅ All images found!")
    
    # Check for extra files (images in directory not referenced in HTML)
    extra_images = []
    for img_path in actual_images:
        if img_path not in daily_life_images:
            extra_images.append(img_path)
    
    if extra_images:
        print(f"\nℹ️ Extra Images in Directory ({len(extra_images)}):")
        for img in extra_images:
            print(f"  - {img}")
    
    print("\n=== Directory Structure ===")
    print(f"Images directory structure: {image_base_dir}/")
    for root, dirs, files in os.walk(image_base_dir):
        level = root.replace(image_base_dir, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                print(f"{subindent}{file}")

if __name__ == "__main__":
    main()
