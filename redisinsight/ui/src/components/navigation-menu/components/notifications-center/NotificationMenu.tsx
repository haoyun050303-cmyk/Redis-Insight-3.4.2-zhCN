import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  notificationCenterSelector,
  setIsCenterOpen,
} from 'uiSrc/slices/app/notifications'
import { NotificationsIcon } from 'uiSrc/components/base/icons'
import {
  SideBarItem,
  SideBarItemIcon,
} from 'uiSrc/components/base/layout/sidebar'
import { NAVIGATION_LABELS } from '../../navigation.labels'
import NotificationCenter from './NotificationCenter'
import PopoverNotification from './PopoverNotification'

import styles from './styles.module.scss'

const NavButton = () => {
  const { isCenterOpen, totalUnread } = useSelector(notificationCenterSelector)

  const dispatch = useDispatch()

  const onClickIcon = () => {
    dispatch(setIsCenterOpen())
  }

  const Btn = (
    <SideBarItem
      tooltipProps={{
        text: NAVIGATION_LABELS.notifications.tooltipText,
        placement: 'right',
      }}
      onMouseDownCapture={onClickIcon}
      isActive={isCenterOpen}
    >
      <SideBarItemIcon
        icon={NotificationsIcon}
        aria-label={NAVIGATION_LABELS.notifications.ariaLabel}
        data-testid="notification-menu-button"
      />
    </SideBarItem>
  )

  return (
    <>
      {Btn}
      {totalUnread > 0 && !isCenterOpen && (
        <div
          className={styles.badgeUnreadCount}
          data-testid="total-unread-badge"
        >
          {totalUnread > 9 ? '9+' : totalUnread}
        </div>
      )}
    </>
  )
}

const NotificationMenu = () => (
  <div className={styles.wrapper} data-testid="notification-menu">
    <NavButton />
    <NotificationCenter />
    <PopoverNotification />
  </div>
)

export default NotificationMenu
