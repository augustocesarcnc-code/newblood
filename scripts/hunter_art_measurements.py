"""Read-only alpha-component measurement shared by the Hunter audits."""
def body_box(tile):
 a=tile.getchannel('A');pixels=a.load();seen=set();parts=[]
 for y in range(tile.height):
  for x in range(tile.width):
   if (x,y) in seen or pixels[x,y]<=80:continue
   stack=[(x,y)];seen.add((x,y));count=0;l=r=x;t=b=y
   while stack:
    u,v=stack.pop();count+=1;l=min(l,u);r=max(r,u);t=min(t,v);b=max(b,v)
    for n,m in [(u-1,v),(u+1,v),(u,v-1),(u,v+1)]:
     if 0<=n<tile.width and 0<=m<tile.height and (n,m) not in seen and pixels[n,m]>80:seen.add((n,m));stack.append((n,m))
   parts.append((count,(l,t,r+1,b+1)))
 if not parts:return None
 largest=max(v[0] for v in parts);boxes=[b for count,b in parts if count>=max(20,largest*.015)]
 return (min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
