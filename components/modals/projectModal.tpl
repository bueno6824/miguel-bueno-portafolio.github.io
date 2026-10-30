<!-- ===== MODAL DE PROYECTO ===== -->
<div id="projectModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="modalTitle">

    <div class="modal-overlay" onclick="closeProjectModal()"></div>

    <div class="modal-content">

        <button class="modal-close" type="button" onclick="closeProjectModal()" aria-label="Cerrar proyecto">
            ✕
        </button>

        <!-- ==============================
         MEDIA
    ============================== -->

        <div class="modal-media">

            <button class="carousel-prev carousel-btn" type="button" aria-label="Contenido anterior">
                <svg class="carousel-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>

            <div id="carouselTrack" class="carousel-track"></div>

            <button class="carousel-next carousel-btn" type="button" aria-label="Contenido siguiente">
                <svg class="carousel-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>

        </div>

        <!-- ==============================
         PROJECT INFO
    ============================== -->

        <div class="modal-info">

            <div class="modal-meta">

                <span id="modalCategory" class="modal-tag"></span>

                <span id="modalLevel" class="modal-tag"></span>

                <span id="modalYear" class="modal-tag"></span>

            </div>

            <h2 id="modalTitle"></h2>

            <p id="modalDescription" class="modal-description"></p>

            <div class="modal-project-summary">

                <article id="modalRoleBlock" class="modal-summary-item">
                    <span class="modal-summary-label">
                        👨‍💻 Rol
                    </span>

                    <strong id="modalRole"></strong>
                </article>

                <article id="modalStatusBlock" class="modal-summary-item">
                    <span class="modal-summary-label">
                        📌 Estado
                    </span>

                    <strong id="modalStatus"></strong>
                </article>

                <article id="modalDurationBlock" class="modal-summary-item">
                    <span class="modal-summary-label">
                        ⏱ Duración
                    </span>

                    <strong id="modalDuration"></strong>
                </article>

            </div>

            <!-- ==============================
           STACK
      ============================== -->

            <section class="modal-section">

                <h3 class="modal-subtitle">
                    Tecnologías
                </h3>

                <div id="modalStack" class="badges modal-stack"></div>

            </section>

            <!-- ==============================
           CASE STUDY
      ============================== -->

            <div class="project-case-study">

                <div class="project-detail-block">
                    <h3>🎯 Objetivo</h3>
                    <p id="modalObjective"></p>
                </div>

                <div class="project-detail-block">
                    <h3>🧩 Problema</h3>
                    <p id="modalProblem"></p>
                </div>

                <div class="project-detail-block">
                    <h3>💡 Solución</h3>
                    <p id="modalSolution"></p>
                </div>

                <div class="project-detail-block">
                    <h3>👨‍💻 Mi participación</h3>
                    <p id="modalParticipation"></p>
                </div>

                <section id="modalFeaturesBlock" class="project-detail-block project-detail-wide">
                    <h3>
                        ✨ Características principales
                    </h3>

                    <ul id="modalFeatures" class="project-feature-list"></ul>
                </section>

                <div class="project-detail-block">
                    <h3>⚙️ Retos principales</h3>
                    <ul id="modalChallenges"></ul>
                </div>

                <div class="project-detail-block">
                    <h3>📚 Aprendizajes</h3>
                    <ul id="modalLearnings"></ul>
                </div>

            </div>

            <!-- ==============================
          ACTIONS
        ============================== -->

            <div class="modal-actions">

                <a id="modalDemo" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    🚀 Live Demo
                </a>
                <a id="modalCode" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                    💻 Código
                </a>

            </div>


            <nav class="modal-project-navigation" aria-label="Navegación entre proyectos">

                <button id="modalPreviousProject" class="modal-project-navigation-button" type="button">
                    <span aria-hidden="true">
                        ←
                    </span>

                    <span class="modal-navigation-content">
                        <small>
                            Proyecto anterior
                        </small>

                        <strong id="modalPreviousProjectTitle">
                            Anterior
                        </strong>
                    </span>
                </button>

                <button id="modalNextProject" class="modal-project-navigation-button next" type="button">
                    <span class="modal-navigation-content">
                        <small>
                            Proyecto siguiente
                        </small>

                        <strong id="modalNextProjectTitle">
                            Siguiente
                        </strong>
                    </span>

                    <span aria-hidden="true">
                        →
                    </span>
                </button>

            </nav>



        </div>

    </div>

</div>