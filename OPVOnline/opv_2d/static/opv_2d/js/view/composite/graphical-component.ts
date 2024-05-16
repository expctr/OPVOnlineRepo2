/*
 * В данном фале содержжится интерфейс, который коответствует компоненте в паттерне
 * Composite.
 */

interface GraphicalComponent {
    doTraversal(visitor: Visitor): void
}