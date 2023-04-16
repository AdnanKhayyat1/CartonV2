import React from 'react'
import { Modal } from 'antd'
import EmojiPicker from 'emoji-picker-react'
function IconModal({showIconPicker}) {
  return (
    <Modal
    footer={null}
    open={showIconPicker}
    >
        <EmojiPicker/>
    </Modal>
  )
}

export default IconModal