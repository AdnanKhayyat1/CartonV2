import React from 'react'
import {Form, Select, Input, Radio, Switch} from 'antd'
import { COVER_IMAGE_URLS } from '../../tools/constants';
function Styler({objConfig, setObjConfig}) {
  return (
    <>
        <Form
          layout="vertical"
          name="config"
          fields={objConfig}
          style={{ maxWidth: 600 }}
          onValuesChange={(_, allFields) => {
            setObjConfig(
              Object.entries(allFields).map(([name, value]) => ({
                name,
                value,
              }))
            );
          }}
        >
          <Form.Item label="Color" name="color">
            <Select>
              {COVER_IMAGE_URLS.map((color) => {
                return (
                  <Select.Option value={color}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="color-icon"
                        style={{
                          backgroundColor: color,
                        }}
                      ></div>
                      {color}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Font" name="font">
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio value=""> Default </Radio>
              <Radio value="Montserrat"> Simple </Radio>
              <Radio value="Times New Roman"> Serif </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Align" name="align">
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio value="left"> Left </Radio>
              <Radio value="center"> Center </Radio>
              <Radio value="right"> Right </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Show Tags" valuePropName="checked" name="showTags">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Show Properties"
            valuePropName="checked"
            name="showProps"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Custom CSS" name="customCSS">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
    </>
  )
}

export default Styler