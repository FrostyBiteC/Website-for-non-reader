
import os
import shutil

def main():
    source_dir = "pasteImageNature"
    target_dir = "images/nature"

    # List all files in source directory
    source_files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]
    print(f"Found {len(source_files)} files in pasteImageNature: {source_files}")

    # Check if each file exists in target directories
    missing_files = []
    for filename in source_files:
        found = False
        # Recursively search in target directory
        for root, _, files in os.walk(target_dir):
            if filename in files:
                print(f"✅ {filename} exists in {os.path.relpath(root, target_dir)}")
                found = True
                break
        if not found:
            print(f"❌ {filename} not found in any images/nature subdirectory")
            missing_files.append(filename)

    # Copy missing files to appropriate directories
    if missing_files:
        print(f"\nCopying {len(missing_files)} missing files...")
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

        for filename in missing_files:
            subdir = file_to_subdir.get(filename)
            if subdir:
                destination_path = os.path.join(target_dir, subdir, filename)
                source_path = os.path.join(source_dir, filename)
                shutil.copy(source_path, destination_path)
                print(f"Copied {filename} to {subdir}/")
            else:
                print(f"Warning: No subdirectory mapping for {filename}")

    print("\n✅ Image check completed!")

if __name__ == "__main__":
    main()
