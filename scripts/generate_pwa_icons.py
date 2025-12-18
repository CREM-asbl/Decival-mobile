from PIL import Image
import os

def resize_icon(input_path, output_path, size):
    print(f"Resizing to {size}x{size}...")
    try:
        img = Image.open(input_path)
        # Use high-quality resampling
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error resizing to {size}: {e}")

if __name__ == "__main__":
    input_logo = "public/logo.png"
    output_dir = "public/icons"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    for size in sizes:
        output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
        resize_icon(input_logo, output_path, size)
