from PIL import Image
import os

def process_logo(input_path, output_dir):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Crop to content (trim transparent edges)
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)

        # Pad to square
        w, h = img.size
        new_size = max(w, h)
        print(f"Original Size: {w}x{h}, New Square Size: {new_size}x{new_size}")
        
        new_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
        paste_x = (new_size - w) // 2
        paste_y = (new_size - h) // 2
        new_img.paste(img, (paste_x, paste_y))
        
        # Save transparent logo
        transparent_path = os.path.join(output_dir, "logo_transparent.png")
        new_img.save(transparent_path, "PNG")
        print(f"Saved transparent logo to {transparent_path}")

        # Save as favicon.ico (multi-size)
        favicon_path = os.path.join(output_dir, "favicon.ico")
        new_img.save(favicon_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"Saved favicon.ico to {favicon_path}")

        # Save as icon.png (192x192) for Android/PWA
        icon_path = os.path.join(output_dir, "icon.png")
        new_img.resize((192, 192), Image.Resampling.LANCZOS).save(icon_path, "PNG")
        print(f"Saved icon.png to {icon_path}")

        # Save as apple-touch-icon.png (180x180) for iOS
        apple_icon_path = os.path.join(output_dir, "apple-touch-icon.png")
        # Apple icons usually have white background, but transparent is fine for now as iOS adds white bg automatically if transparent
        # Actually better to keep transparent for flexibility or add white bg if needed. Let's keep transparent.
        new_img.resize((180, 180), Image.Resampling.LANCZOS).save(apple_icon_path, "PNG")
        print(f"Saved apple-touch-icon.png to {apple_icon_path}")
        
        # Also create a larger icon for OG Image (512x512) just in case
        og_icon_path = os.path.join(output_dir, "icon-512.png")
        new_img.resize((512, 512), Image.Resampling.LANCZOS).save(og_icon_path, "PNG")
        print(f"Saved icon-512.png to {og_icon_path}")

    except Exception as e:
        print(f"Error processing logo: {e}")

if __name__ == "__main__":
    input_file = "public/logo_circuit_s.png"
    output_directory = "public"
    process_logo(input_file, output_directory)
