from pathlib import Path
shapes=[
 '<path d="M15 49L47 17M35 17H47V29M18 38L26 46"/>',
 '<path d="M27 16H37V27H48V37H37V48H27V37H16V27H27Z"/>',
 '<path d="M12 42L36 18M22 50L46 26M16 28L28 16M34 48L48 34"/>',
 '<path d="M14 13L26 33M28 10L40 30M42 12L52 28M12 44Q32 54 52 44M24 38V49M40 37V50"/>',
 '<path d="M32 12L49 23V42L32 53L15 42V23ZM32 18L43 43H21ZM21 24H43L32 47Z"/>',
 '<path d="M16 28Q16 12 32 24Q48 12 48 28Q48 38 32 50Q16 38 16 28ZM32 25V42M24 33H40"/>',
 '<path d="M32 12L49 20V34Q47 45 32 53Q17 45 15 34V20ZM32 21V43M23 30H41"/>',
 '<circle cx="32" cy="32" r="20"/><path d="M32 15L48 42H16ZM17 23H47L32 49M6 32H12M52 32H58"/>',
 '<path d="M32 9L38 28L54 32L38 36L32 55L26 36L10 32L26 28ZM20 16L24 22M44 16L40 22"/>',
 '<path d="M32 7L37 23L51 13L42 27L58 32L42 37L51 51L37 41L32 57L27 41L13 51L22 37L6 32L22 27L13 13L27 23Z"/>'
]
colors=['#ead6a2','#ec466d','#a7cee9'];out=['<svg xmlns="http://www.w3.org/2000/svg" width="640" height="192" viewBox="0 0 640 192">']
for row,col in enumerate(colors):
 for i,shape in enumerate(shapes):
  if row==0 and i==7:shape='<path d="M14 16L46 48M18 12L50 44M12 42L22 52M18 42L12 48M50 16L18 48M46 12L14 44M42 42L52 52"/>'
  if row==0 and i==8:shape='<path d="M28 10H36V38L32 49L28 38ZM20 39H44M32 49V56M26 56H38"/>'
  if row==0 and i==9:shape='<path d="M12 48L36 24M24 54L48 30M10 34L34 10M25 10H34V19M27 24H36V33M39 30H48V39"/>'
  extra=['<path d="M19 46Q10 28 23 16M45 46Q54 28 41 16"/>','<path d="M12 18L22 24L32 16L42 24L52 18L46 38L32 50L18 38Z"/>','<path d="M16 14L20 33M30 10L32 35M45 14L43 34M18 46Q32 55 47 43"/>'][row]
  out.append(f'<g transform="translate({i*64},{row*64})"><rect x="2" y="2" width="60" height="60" rx="8" fill="#120e16" stroke="#685262"/><path d="M8 12V8H12M52 8H56V12M8 52V56H12M52 56H56V52" stroke="{col}" fill="none" opacity=".6"/><g fill="none" stroke="{col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{shape}<g opacity=".22" stroke-width="1">{extra}</g></g><circle cx="54" cy="53" r="2" fill="{col}" opacity="{.3+i*.06}"/></g>')
out.append('</svg>');(Path(__file__).resolve().parents[1]/'assets/skills/icons.svg').write_text(''.join(out))
