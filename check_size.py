import os
for f in sorted(os.listdir('public/favicon')):
    path = os.path.join('public/favicon', f)
    size = os.path.getsize(path)
    print(f'{size:>8}B  {f}')
