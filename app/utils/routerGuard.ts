import React, { useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { sendActivity } from './annonymous'
import {startDuration, stopDuration} from './timeDuration'

/**
 * Tracks the duration a screen is focused and sends activity on leave.
 *
 * @param {string} type - The type of activity (e.g., 'view').
 * @param {number | string | null} [targetId] - The ID of the target being viewed.
 */
function usePageLeaveTracker(type: string, targetId: string|number|null) {
  useFocusEffect(
    React.useCallback(() => {
      // 1. Screen is focused (Equivalent to 'beforeEach' start)
      const startVisitDuration = startDuration();

      // 2. Return cleanup function (Equivalent to 'beforeEach' next navigation/unmount)
      return async () => {
        try {
          const totalDuration = stopDuration(startVisitDuration)

          // Send activity on screen unfocus/leave
          await sendActivity({
            type,
            targetId,
            details: {
              duration: totalDuration,
              priority: 0.5,
              extraDetails: '',
              device: "android"
            },
          })
        } catch (err) {
          console.error('Page leave tracking error:', err)
        }
      }
    }, [type, targetId])
  )
}

export default usePageLeaveTracker