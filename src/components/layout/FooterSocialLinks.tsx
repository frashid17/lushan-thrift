'use client';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';

/** TikTok mark — MUI has no official TikTok icon; matches MUI icon sizing (24×24 viewBox). */
function TikTokIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </SvgIcon>
  );
}

type Props = {
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
};

const iconSx = { fontSize: 26 } as const;

export function FooterSocialLinks({ instagramUrl, facebookUrl, tiktokUrl }: Props) {
  const items = [
    { href: instagramUrl, label: 'Instagram', Icon: InstagramIcon },
    { href: facebookUrl, label: 'Facebook', Icon: FacebookIcon },
    { href: tiktokUrl, label: 'TikTok', Icon: TikTokIcon },
  ].filter((x) => Boolean(x.href));

  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Follow us</h3>
      <ul className="mt-2 flex flex-wrap items-center gap-0.5">
        {items.map(({ href, label, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={label}
              title={label}
              className="inline-flex rounded-full p-2 text-stone-600 transition hover:bg-stone-200/80 hover:text-stone-900"
            >
              <Icon sx={iconSx} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
