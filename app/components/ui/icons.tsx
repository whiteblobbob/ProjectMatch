import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiCalendarLine,
  RiCameraLine,
  RiCheckLine,
  RiCloseLine,
  RiCompass3Line,
  RiComputerLine,
  RiDeleteBinLine,
  RiEditLine,
  RiErrorWarningLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileTextLine,
  RiFilter3Line,
  RiHomeLine,
  RiInstagramLine,
  RiInboxLine,
  RiInformationLine,
  RiLink,
  RiLoader4Line,
  RiLinkedinBoxLine,
  RiLockLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiMenuLine,
  RiGithubLine,
  RiBehanceLine,
  RiDribbbleLine,
  RiTiktokLine,
  RiTwitterXLine,
  RiYoutubeLine,
  RiDiscordLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiTelegram2Line,
  RiSearchLine,
  RiShieldCheckLine,
  RiTeamLine,
  RiTimeLine,
  RiToolsLine,
  RiUploadCloud2Line,
  RiUserAddLine,
  RiUserLine,
  RiVideoOnLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<RemixiconComponentType>;

function remixIcon(
  Icon: RemixiconComponentType,
  defaultClassName = "size-[18px]",
) {
  function ProjectMatchIcon({ className = defaultClassName, ...props }: IconProps) {
    return (
      <Icon
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      />
    );
  }

  return ProjectMatchIcon;
}

export const ChevronDownIcon = remixIcon(RiArrowDownSLine);
export const PlusIcon = remixIcon(RiAddLine);
export const PencilIcon = remixIcon(RiEditLine);
export const TrashIcon = remixIcon(RiDeleteBinLine);
export const XIcon = remixIcon(RiCloseLine);
export const ArrowLeftIcon = remixIcon(RiArrowLeftLine);
export const ArrowRightIcon = remixIcon(RiArrowRightLine);
export const ArrowUpRightIcon = remixIcon(RiArrowRightUpLine);
export const CalendarIcon = remixIcon(RiCalendarLine);
export const CameraIcon = remixIcon(RiCameraLine);
export const CheckIcon = remixIcon(RiCheckLine);
export const ClockIcon = remixIcon(RiTimeLine);
export const ExternalLinkIcon = remixIcon(RiExternalLinkLine);
export const LaptopIcon = remixIcon(RiComputerLine);
export const UsersIcon = remixIcon(RiTeamLine);
export const VideoIcon = remixIcon(RiVideoOnLine);
export const WarningIcon = remixIcon(RiErrorWarningLine);
export const LinkIcon = remixIcon(RiLink);
export const MapPinIcon = remixIcon(RiMapPinLine);
export const SearchIcon = remixIcon(RiSearchLine);
export const MenuIcon = remixIcon(RiMenuLine);
export const UserIcon = remixIcon(RiUserLine);
export const InboxIcon = remixIcon(RiInboxLine);
export const CompassIcon = remixIcon(RiCompass3Line);
export const UserAddIcon = remixIcon(RiUserAddLine);
export const EyeIcon = remixIcon(RiEyeLine);
export const EyeOffIcon = remixIcon(RiEyeOffLine);
export const UploadIcon = remixIcon(RiUploadCloud2Line);
export const FileIcon = remixIcon(RiFileTextLine);
export const ShieldCheckIcon = remixIcon(RiShieldCheckLine);
export const InformationIcon = remixIcon(RiInformationLine);
export const HomeIcon = remixIcon(RiHomeLine);
export const LockIcon = remixIcon(RiLockLine);
export const ToolsIcon = remixIcon(RiToolsLine);
export const LogoutIcon = remixIcon(RiLogoutBoxRLine);
export const LoaderIcon = remixIcon(RiLoader4Line);
export const FilterIcon = remixIcon(RiFilter3Line);
export const InstagramIcon = remixIcon(RiInstagramLine);
export const LinkedinIcon = remixIcon(RiLinkedinBoxLine);
export const GithubIcon = remixIcon(RiGithubLine);
export const BehanceIcon = remixIcon(RiBehanceLine);
export const DribbbleIcon = remixIcon(RiDribbbleLine);
export const TiktokIcon = remixIcon(RiTiktokLine);
export const XSocialIcon = remixIcon(RiTwitterXLine);
export const YoutubeIcon = remixIcon(RiYoutubeLine);
export const DiscordIcon = remixIcon(RiDiscordLine);
export const FacebookIcon = remixIcon(RiFacebookCircleLine);
export const WhatsappIcon = remixIcon(RiWhatsappLine);
export const TelegramIcon = remixIcon(RiTelegram2Line);
