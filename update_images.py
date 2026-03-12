import os
import re

def update_image_paths(html_file, category):
    """Update image paths in HTML file from placehold.co to local paths"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all gallery items
    gallery_items = re.findall(r'(<div class="gallery-item" data-category="([^"]+)">(.*?)</div>)', content, re.DOTALL)
    
    for full_item, subcategory, item_content in gallery_items:
        # Find the img tag and button with data-text in this gallery item
        img_match = re.search(r'<img src="([^"]+)" alt="([^"]+)"', item_content)
        button_match = re.search(r'<button class="tts-button" data-text="([^"]+)"', item_content)
        
        if img_match and button_match and "https://placehold.co/" in img_match.group(1):
            src = img_match.group(1)
            item_name = button_match.group(1).lower()
            item_name = item_name.replace(' ', '-').replace('_', '-')
            subcategory = subcategory.replace(' ', '-').replace('_', '-')
            
            local_path = f'images/{category}/{subcategory}/{item_name}.png'
            
            # Replace this specific src only within this gallery item
            updated_item_content = item_content.replace(src, local_path)
            updated_full_item = full_item.replace(item_content, updated_item_content)
            content = content.replace(full_item, updated_full_item)
    
    # Write the updated content back to the file
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {html_file} with local image paths")

def main():
    # Map HTML files to their main categories
    html_files = {
        'knowing/nature.html': 'nature',
        'knowing/daily-life.html': 'daily-life',
        'knowing/people.html': 'people',
        'knowing/objects.html': 'objects',
        'knowing/concepts.html': 'concepts',
        'knowing/elements.html': 'elements',
        'knowing/science.html': 'science'
    }
    
    for html_file, category in html_files.items():
        if os.path.exists(html_file):
            update_image_paths(html_file, category)
        else:
            print(f"File not found: {html_file}")

if __name__ == "__main__":
    main()