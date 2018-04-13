from PIL import Image
import os

images_directory = "/media/sf_UPJV_WEB3D/img"
width = 1024
height = 768


def createBaseDirectory():
    dirname = os.path.dirname(images_directory)
    new_directory = os.path.join(dirname, "resized", "{}x{}".format(width, height))
    if not os.path.isdir(new_directory):
        os.makedirs(new_directory)
    return new_directory


def main():
    d = createBaseDirectory()
    if os.path.isdir(images_directory):
        for root, dirs, files in os.walk(images_directory):
            for file in files:
                fullpath = os.path.join(root, file)

                try:
                    img = Image.open(fullpath)
                    img = img.resize((width, height), Image.ANTIALIAS)
                    destination = os.path.join(d, os.path.relpath(fullpath, images_directory).lstrip('/'))
                    if not os.path.isdir(os.path.dirname(destination)):
                        os.makedirs(os.path.dirname(destination))
                    img.save(destination)
                except Exception:
                    print("Error : Failed to resize file '{}'".format(fullpath))


if __name__ == '__main__':
    main()
