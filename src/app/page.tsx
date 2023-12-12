import styles from './page.module.css'
import UploaderForm from '@/app/component/uploader-input-form'

export default function Home() {
  return (
    <main className={styles.main}>
      <UploaderForm />
    </main>
  )
}
