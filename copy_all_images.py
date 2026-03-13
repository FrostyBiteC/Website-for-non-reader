import os
import shutil

def main():
    source_dir = "pasteImageNature"
    target_dir = "images/nature"

    # List all files in source directory
    source_files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]
    print(f"Found {len(source_files)} files in pasteImageNature: {source_files}")

    # Define mapping of file names to target subdirectories
    file_to_subdir = {
        "Astronaut.png": "space",
        "bird.png": "birds",
        "butterfly.png": "insects",
        "cactus.png": "plants",
        "cat.png": "animals",
        "cloud.png": "clouds",
        "coral.png": "ocean",
        "dog.png": "animals",
        "dolpin.png": "fish",
        "elephant.png": "animals",
        "fern.png": "plants",
        "fish.png": "fish",
        "flower.png": "flowers",
        "galaxy.png": "space",
        "grass.png": "plants",
        "lion.png": "animals",
        "moon.png": "space",
        "planet.png": "space",
        "rainbow.png": "rainbow",
        "rain.png": "weather",
        "rocket.png": "space",
        "seahorse.png": "fish",
        "shark.png": "ocean",
        "snow.png": "weather",
        "star.png": "space",
        "sunflower.png": "flowers",
        "sun.png": "weather",
        "thunder.png": "weather",
        "tree.png": "trees",
        "whale.png": "ocean"
    }

    # Copy all files to appropriate directories (overwrite if existing)
    print("\nCopying all files to images/nature/ subdirectories (overwriting if existing)...")
    for filename in source_files:
        subdir = file_to_subdir.get(filename)
        if subdir:
            destination_path = os.path.join(target_dir, subdir, filename)
            source_path = os.path.join(source_dir, filename)
            shutil.copy(source_path, destination_path)
            print(f"Copied {filename} to {subdir}/")
        else:
            print(f"Warning: No subdirectory mapping for {filename}")

    # Verify each image is correctly copied by checking file sizes
    print("\nVerifying file sizes...")
    all_copied = True
    for filename in source_files:
        source_path = os.path.join(source_dir, filename)
        source_size = os.path.getsize(source_path)
        
        # Find the file in target directory
        found = False
        for root, _, files in os.walk(target_dir):
            if filename in files:
                target_path = os.path.join(root, filename)
                target_size = os.path.getsize(target_path)
                if source_size == target_size:
                    print(f"✅ {filename} - sizes match ({source_size} bytes)")
                else:
                    print(f"❌ {filename} - size mismatch (source: {source_size} bytes, target: {target_size} bytes)")
                    all_copied = False
                found = True
                break
        
        if not found:
            print(f"❌ {filename} - not found in target directory")
            all_copied = False

    if all_copied:
        print("\n✅ All images successfully copied and verified!")
    else:
        print("\n⚠️  Some images failed verification")

if __name__ == "__main__":
    main()
