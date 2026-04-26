import os
import shutil
import yaml
import subprocess
import sys
from pathlib import Path
from datetime import datetime
import re
import concurrent.futures
import hashlib
from PIL import Image

# Mapping Obsidian callouts to Hugo Doks callout contexts and icons
doks_callout_mapping = {
    "info":    {"context": "note", "icon": "outline/info-circle"},
    "note":    {"context": "note", "icon": "outline/info-circle"},
    "question":    {"context": "note", "icon": "outline/help-octagon"},
    "thumbup":    {"context": "note", "icon": "outline/thumb-up"},
    "thumbdown":    {"context": "caution", "icon": "outline/thumb-down"},
    "tip":     {"context": "tip", "icon": "outline/rocket"},
    "caution": {"context": "caution", "icon": "outline/alert-triangle"},
    "warning": {"context": "caution", "icon": "outline/alert-triangle"},
    "danger":  {"context": "danger", "icon": "outline/alert-octagon"},
}

# Updated regex: Ensures callouts end when an empty line or a non-`>` line is encountered
# callout_pattern = re.compile(
#     r"^>?\[!(\w+)\] ([^\n]+)\n((?:>.*\n?)*)",  # Matches callouts where each line starts with '>'
#     re.MULTILINE
# )

# Regex pattern to match Obsidian callouts
callout_pattern = re.compile(r"(^>?\[!(\w+)\] ([^\n]+)\n((?:>.*\n?)*))", re.MULTILINE)


# Regex pattern to match Obsidian image embeds with captions
image_pattern = re.compile(r"!\[\[([\w\-.]+\.(?:png|jpg|jpeg|webp|gif|svg))\]\]\n?> (.+)")

def get_image_dimensions(image_path):
    """Get the width and height of an image file if it exists."""
    if os.path.exists(image_path):
        try:
            with Image.open(image_path) as img:
                return img.size  # Returns (width, height)
        except Exception as e:
            print(f"⚠️ Error reading image {image_path}: {e}")
    return (700, 1000)  # Default fit size if the image is missing

def convert_image(match):
    """Convert Obsidian image embeds with captions to Hugo figure shortcodes with dynamic fit dimensions."""
    image_file = match.group(1).strip()  # Extract image filename
    caption = match.group(2).strip()  # Extract caption text

    # Check if the image file exists and get its dimensions
    image_path = os.path.join("static", image_file)  # Adjust based on your project structure
    width, height = get_image_dimensions(image_path)

    # Maintain aspect ratio but fit within 700x1000
    fit_width = min(width, 700)  # Don't exceed 700px width
    fit_height = min(height, 1000)  # Don't exceed 1000px height

    # Generate figure shortcode with dynamic process fit
    return f'{{{{< figure src="{image_file}" alt="Alternative description" caption="{caption}" process="fit {fit_width}x{fit_height}" >}}}}'

def convert_callout(match):
    """Convert an Obsidian callout to a Hugo Doks callout format."""
    callout_type = match.group(2).lower()  # Extract callout type (e.g., "info")
    title = match.group(3)  # Extract callout title
    content = match.group(4)  # Extract callout content

    # Remove leading '>' from multi-line content
    content_lines = [line.lstrip("> ").strip() for line in content.split("\n") if line.startswith(">")]
    content = "\n".join(content_lines)

    # Get Doks callout properties or fallback to "note"
    doks_data = doks_callout_mapping.get(callout_type, {"context": "note", "icon": "outline/info-circle"})

    return f'{{{{< callout context="{doks_data["context"]}" title="{title}" icon="{doks_data["icon"]}" >}}}}\n{content}\n{{{{< /callout >}}}}\n'


def process_markdown(file_path):
    """Process a Markdown file and convert callouts."""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_hash = hashlib.md5(content.encode()).hexdigest()  # Get original content hash

    # Convert images first
    new_content = image_pattern.sub(convert_image, content)

    # Apply regex transformation
    new_content = callout_pattern.sub(convert_callout, new_content)

    # Write only if content changed
    new_hash = hashlib.md5(new_content.encode()).hexdigest()
    if original_hash != new_hash:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Updated: {file_path}")

HUGO_FRONTMATTER = {
    "title": "{title}",
    "description": "Default Description",
    "summary": "",
    "date": "{date}",
    "lastmod": "{lastmod}",
    "draft": False,
    "weight": 810,
    "toc": True,
    "contributors": []
}

def format_title(filename):
    """Convert 'example-name.md' to 'Example Name'"""
    name = re.sub(r'[-_]', ' ', filename.stem)
    return name.title()

def format_directory_title(directory):
    """Convert 'example-directory' to 'Example Directory'"""
    name = re.sub(r'[-_]', ' ', directory.name)
    return name.title()

def merge_frontmatter(existing, defaults):
    """Merge existing frontmatter with defaults, ensuring no duplicates."""
    merged = defaults.copy()
    merged.update(existing)
    return merged

def extract_frontmatter(content):
    """Extract frontmatter from a Markdown file."""
    if content.startswith("---"):
        match = re.search(r'(?s)^---\n(.*?)\n---\n', content)
        if match:
            frontmatter_yaml = match.group(1)
            return yaml.safe_load(frontmatter_yaml), content[len(match.group(0)):]  # Extract body
    return {}, content


def normalize_frontmatter(existing):
    """Ensure frontmatter includes defaults and remove duplicates."""
    current_datetime = '2025-02-22T09:02:28.392283'
    defaults = HUGO_FRONTMATTER.copy()
    defaults["date"] = current_datetime
    defaults["lastmod"] = current_datetime

    normalized = defaults.copy()
    normalized.update(existing)

    # Remove duplicate values ensuring required fields exist
    for key in defaults:
        if isinstance(defaults[key], list) and key in existing:
            normalized[key] = list(set(existing[key] + defaults[key]))

    return normalized

def extract_frontmatter(content):
    """Extract frontmatter from a Markdown file."""
    if content.startswith("---"):
        match = re.search(r'(?s)^---\n(.*?)\n---\n', content)
        if match:
            frontmatter_yaml = match.group(1)
            return yaml.safe_load(frontmatter_yaml), content[len(match.group(0)):]  # Extract body
    return {}, content

def add_frontmatter(file_path, title=None):
    """Ensure frontmatter is set, merging existing fields with defaults."""
    if not file_path.exists():
        file_path.touch()

    with open(file_path, "r+", encoding="utf-8") as f:
        content = f.read()
        existing_frontmatter, body = extract_frontmatter(content)

        merged_frontmatter = normalize_frontmatter(existing_frontmatter)
        merged_frontmatter["title"] = title or format_title(file_path)
        new_frontmatter = "---\n" + yaml.dump(merged_frontmatter, default_flow_style=False) + "---\n"
        # converted_content = convert_links(body)

        f.seek(0)
        f.write(new_frontmatter + body)
        f.truncate()

def load_config(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def convert_callouts_in_files(directory):
    """Recursively process all Markdown files in a directory using multiple threads."""
    md_files = []

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                md_files.append(os.path.join(root, file))

    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(process_markdown, md_files)

# Regex pattern to find Obsidian-style links
obsidian_link_pattern = re.compile(r"\[\[([^\]|#]+)?(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]")

def find_markdown_files(root_dir):
    """Find all Markdown files and return a mapping {filename (without extension) -> relative path}."""
    md_files = {}
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".md"):
                # Get the Hugo content-relative path (strip content/ and .md)
                relative_path = os.path.relpath(os.path.join(root, file), root_dir)
                hugo_ref_path = os.path.splitext(relative_path)[0]  # Remove .md extension
                hugo_ref_path = hugo_ref_path.replace("\\", "/")  # Ensure forward slashes for Hugo
                md_files[os.path.splitext(file)[0].lower()] = hugo_ref_path
    return md_files

def convert_obsidian_links(match, file_path, md_files):
    """Convert Obsidian-style links to Hugo format, handling file, heading, and custom text references."""
    linked_file = match.group(1).strip().lower() if match.group(1) else None  # Extract filename/path
    heading = match.group(2).strip() if match.group(2) else None  # Extract heading (if any)
    custom_text = match.group(3).strip() if match.group(3) else None  # Extract custom text (if any)

    # If it's a heading in the current document (e.g., [[#Courses]])
    if linked_file is None and heading:
        link_text = custom_text if custom_text else heading.replace("_", " ").capitalize()
        return f"[{link_text}](#{heading.lower()})"

    # If it's a reference to a heading in another document (e.g., [[elements#cdn]])
    if linked_file in md_files:
        hugo_path = md_files[linked_file]  # Get Hugo's expected path (without .md)
        link_text = custom_text if custom_text else heading.replace("_", " ").capitalize() if heading else linked_file.capitalize()
        if heading:
            return f"[{link_text}]({{{{< ref \"{hugo_path}\" >}}}}#{heading.lower()})"
        return f"[{link_text}]({{{{< ref \"{hugo_path}\" >}}}})"

    # Handle nested paths (e.g., [[projects/projects|projects]])
    if "/" in linked_file:
        hugo_path = linked_file  # Assume the path is correctly structured for Hugo
        link_text = custom_text if custom_text else linked_file.split("/")[-1].capitalize()
        return f"[{link_text}]({{{{< ref \"{hugo_path}\" >}}}})"

    # If the file is not found, print a warning
    print(f"⚠️ Warning: Could not find file for link [[{linked_file if linked_file else ''}#{heading if heading else ''}]]")
    return match.group(0)  # Keep the original if not found

def process_markdown_file(file_path, md_files):
    """Process a single Markdown file and convert Obsidian links."""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = obsidian_link_pattern.sub(lambda match: convert_obsidian_links(match, file_path, md_files), content)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

def process_directory(directory):
    """Recursively process all Markdown files in a directory."""
    md_files = find_markdown_files(directory)  # Build a map of all markdown files

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                process_markdown_file(os.path.join(root, file), md_files)
                # os.system(f"mdformat {os.path.join(root, file)}")

def convert_content(config):
    source_dir = config['params']['source_dir']
    target_dir = config['params']['end_dir']
    middle_dir = config['params']['middle_dir']
    directories = config['params']['directories']
    main_file = config['params']['main_file']

    # Remove and recreate middle directory
    if os.path.exists(middle_dir):
        print(f"Removing existing middle directory: {middle_dir}")
        shutil.rmtree(middle_dir)
    os.makedirs(middle_dir, exist_ok=True)

    # clean target dir
    for directory in directories:
        dir_name = os.path.basename(directory)
        target_path = os.path.join(target_dir, dir_name)

        # Check if the directory exists in end_dir and remove it
        if os.path.exists(target_path):
            print(f"Removing existing directory: {target_path}")
            shutil.rmtree(target_path)

    # Copy directories to middle directory
    for directory in directories:
        dir_name = os.path.basename(directory)
        source_path = os.path.join(source_dir, dir_name)
        middle_path = os.path.join(middle_dir, dir_name)

        if os.path.exists(source_path):
            print(f"Copying {source_path} to {middle_path}")
            shutil.copytree(source_path, middle_path)
        else:
            print(f"Source directory does not exist: {source_path}")

    # Copy main file as _index.md for root directory
    main_file_path = Path(source_dir) / main_file
    if main_file_path.exists():
        target_index_path = Path(target_dir) / "_index.md"
        shutil.copy(main_file_path, target_index_path)
        print(f"!Copying {main_file_path} to {target_index_path}")
        print(f"{target_index_path} exists")

    # Add frontmatter to all Markdown files and create _index.md if needed
    for root, _, files in os.walk(middle_dir):
        dir_path = Path(root)
        for file in files:
            if file.endswith(".md"):
                add_frontmatter(dir_path / file)
        # Create _index.md if it doesn't exist (but not for root dir)
        if dir_path != Path(middle_dir):
            index_path = dir_path / "_index.md"
            if not index_path.exists():
                add_frontmatter(index_path, title=format_directory_title(dir_path))

    # Convert callouts before running obsidian-export
    convert_callouts_in_files(middle_dir)
    process_directory(middle_dir)


    if os.path.exists(source_dir):
        print(f"Copying {middle_dir} to {target_dir}")
        shutil.copytree(middle_dir, target_dir, dirs_exist_ok=True)



if __name__ == "__main__":
    config_path = "config.yaml"  # Adjust this if needed
    config = load_config(config_path)
    convert_content(config)

