import MyInput from './index.vue'
import PriceInput from './PriceInput.vue'
import Buttons from '../Buttons/index.vue'
import { ref, watch } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

export default {
  title: 'App Components/Inputs',
  component: MyInput,
  argTypes: {},
}

const Template = (args) => ({
  components: { MyInput },
  setup() {
    const inputValue = ref('')
    return { args, inputValue }
  },
  template: `
    <div>
      inputValue: {{inputValue}}
      <my-input v-bind="args" class="w-72"  v-model="inputValue" />
    </div>
    `,
})

export const DefaultWithLabel = Template.bind({})
DefaultWithLabel.args = {
  label: 'Desk name',
  placeholder: 'World News',
  htmlName: 'desk',
}

export const DefaultWithoutLabel = Template.bind({})
DefaultWithoutLabel.args = {
  placeholder: 'e.g. example.com',
  htmlName: 'desk',
}

export const AddOnWithLabel = Template.bind({})
AddOnWithLabel.args = {
  label: 'Publication Facebook Profile',
  placeholder: 'URL',
  addOn: true,
  htmlName: 'profile',
}

export const AddOnWithoutLabel = Template.bind({})
AddOnWithoutLabel.args = {
  placeholder: 'URL',
  addOn: true,
  htmlName: 'profile-link',
}

export const WithCharacterCounting = Template.bind({})
WithCharacterCounting.args = {
  placeholder: 'World news',
  htmlName: 'world-news',
  showCount: true,
  maxLength: 5,
}

export const Validate = (args) => ({
  components: { MyInput, Form, Buttons },
  setup() {
    const form = ref({
      email: '',
      password: '',
      confirmPassword: '',
    })
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      current_password: Yup.string().min(6).required(),
      password: Yup.string().min(6).required(),
      confirm_password: Yup.string()
        .required()
        .oneOf([Yup.ref('password')], 'Passwords do not match'),
    })
    return { form, schema }
  },
  template: `
  <Form :validation-schema="schema">
    <my-input
      v-model="form.email"
      label="Email"
      placeholder="hello@storipress.com"
      class="w-72"
      html-name="email"
    />
    <my-input
      v-model="form.password"
      label="Password"
      class="w-72 mt-4"
      html-type="password"
      html-name="password"
    />
    <my-input
      v-model="form.confirmPassword"
      label="Confirm password"
      class="w-72 mt-4"
      html-type="password"
      html-name="confirm_password"
    />
    <Buttons type="main" color="primary" html-type="submit" class="mt-8 w-72">
      Submit
    </Buttons>
  </Form>
  `,
})

// scenarios: not yet triggered debounce, so no error message will be displayed
// 1. api returns an error message
// 2. linkage state between different inputs
export const autoTriggerValidate = (args) => ({
  components: { MyInput, Form, Buttons },
  setup() {
    const form = ref({
      name: '',
      key: '',
    })
    const schema = Yup.object().shape({
      name: Yup.string().max(200).required(),
      field_id: Yup.string()
        .min(3)
        .max(32)
        .matches(/^([a-z]|_).*/, 'must begin with a-z or _')
        .matches(/[a-z0-9_]+$/, 'only allow a-z, 0-9, and _')
        .required(),
    })

    watch(
      () => form.value.name,
      (name) => {
        const result = name.replaceAll(' ', '').toLowerCase()
        form.value.key = result
      },
    )

    return { form, schema }
  },
  template: `
  <Form :validation-schema="schema">
    <my-input
      v-model="form.name"
      label="Name"
      class="w-72"
      html-name="name"
    />
    <my-input
      v-model="form.key"
      label="Field ID"
      class="w-72 mt-4"
      html-name="field_id"
    />
    <Buttons type="main" color="primary" html-type="submit" class="mt-8 w-72">
      Submit
    </Buttons>
  </Form>
  `,
})

export const PriceInputs = (args) => ({
  components: { PriceInput },
  setup() {
    const inputValue = ref('')
    return { inputValue }
  },
  template: /*html*/ `
    <div class="w-72">
      <p class="mb-10">inputValue: {{inputValue}}</p>
      <price-input
        v-model="inputValue"
        label="Yearly price"
        placeholder="0"
        input-id="yearly_price"
        prefix="$"
        suffix="USD/year"
      />
    </div>
  `,
})
